import { runWarm } from '../../utils';
import { getPlateFromRecognition } from '../../database/plate/getPlateFromRecognition';
import { SNS, S3 } from 'aws-sdk';
import { v4 } from 'uuid';
import { PublishInput } from 'aws-sdk/clients/sns';
import { getUserById } from '../../database/user/getUserById';

const sns = new SNS({
  region: 'ap-southeast-2',
});

const s3 = new S3({
  region: 'ap-southeast-2',
});

const getPlateFromRecognitionHandler = async (
  event: AWSLambda.SNSEvent
): Promise<void> => {
  console.log(JSON.stringify(event));

  const { purchase, recognitionPhoto, recognitionResults } = JSON.parse(
    event.Records[0].Sns.Message
  );

  const { plate } = recognitionResults;

  const [savedPlate] = await getPlateFromRecognition(plate);

  if (savedPlate) {
    const [user] = await getUserById(savedPlate.userId);

    const s3ImageKey = v4();

    const decodedImage = Buffer.from(recognitionPhoto, 'base64');

    const saveToS3 = await s3
      .putObject({
        Bucket: process.env.RECOGNITION_IMAGE_BUCKET!,
        Key: `${user.id}/${s3ImageKey}.jpeg`,
        Body: decodedImage,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
      })
      .promise();

    console.log('IMAGE SAVED TO S3', saveToS3);

    const params: PublishInput = {
      Message: JSON.stringify({
        plate,
        purchase,
        user,
        savedPlate,
        s3ImageKey,
        recognitionResults,
      }),
      TopicArn: process.env.NOTIFY_USER_TOPIC_ARN,
    };

    await sns.publish(params).promise();
    console.log('Published to plate service topic');
  }
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(getPlateFromRecognitionHandler);
