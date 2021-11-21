import { runWarm } from '../../utils';
import { getPlateFromRecognition } from '../../database/plate/getPlateFromRecognition';
import { SNS } from 'aws-sdk';
import { PublishInput } from 'aws-sdk/clients/sns';
import { getUserById } from '../../database/user/getUserById';

const sns = new SNS({
  region: 'ap-southeast-2',
});

const getPlateFromRecognitionHandler = async (
  event: AWSLambda.SNSEvent
): Promise<void> => {
  console.log(JSON.stringify(event));

  const { results, purchase } = JSON.parse(event.Records[0].Sns.Message);

  await Promise.all(
    results.map(async (item: any) => {
      const [plate] = await getPlateFromRecognition(item.plate);

      if (plate) {
        const [user] = await getUserById(plate.userId);

        const params: PublishInput = {
          Message: JSON.stringify({ plate, purchase, user }),
          TopicArn: process.env.NOTIFY_USER_TOPIC_ARN,
        };

        await sns.publish(params).promise();
        console.log('Published to plate service topic');
      }
    })
  );
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(getPlateFromRecognitionHandler);
