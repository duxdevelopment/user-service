import { runWarm } from '../../utils';
import { getPlateFromRecognition } from '../../database/plate/getPlateFromRecognition';
import { SNS } from 'aws-sdk';
import { PublishInput } from 'aws-sdk/clients/sns';

const sns = new SNS({
  region: 'ap-southeast-2',
});

const getPlateFromRecognitionHandler = async (
  event: AWSLambda.SNSEvent
): Promise<void> => {
  console.log(JSON.stringify(event));

  const { results, cost } = JSON.parse(event.Records[0].Sns.Message);

  await Promise.all(
    results.map(async (item: any) => {
      const plate = await getPlateFromRecognition(item.plate);

      if (plate.Count != 0) {
        const msg = { plate: plate!.Items![0], cost };

        const params: PublishInput = {
          Message: JSON.stringify(msg),
          TopicArn: process.env.PLATE_SERVICE_TOPIC_ARN,
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
