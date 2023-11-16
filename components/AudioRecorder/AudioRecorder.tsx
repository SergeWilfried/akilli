import React from 'react';
import { Button } from 'react-daisyui';
import { MicrophoneIcon } from '@heroicons/react/24/outline';
interface IProps {
  onFinish: ({ id, audio }: { id: string; audio: Blob }) => void;
}

const AudioRecorder: React.FC<IProps> = ({ onFinish }) => {
  const [isRecording, setIsRecording] = React.useState<boolean>(false);

  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [voiceRecorder, setVoiceRecorder] =
    React.useState<MediaRecorder | null>(null);

  const [content, setContent] = React.useState<Blob | null>(null);

  const onAudioClick = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(audioStream);

      setStream(audioStream);
      setVoiceRecorder(mediaRecorder);
      setIsRecording(true);
    } catch (e) {
      console.log("User didn't allowed us to access the microphone.");
    }
  };

  const onStopRecording = () => {
    if (!isRecording || !stream || !voiceRecorder) return;

    const tracks = stream.getAudioTracks();

    for (const track of tracks) {
      track.stop();
    }

    voiceRecorder.stop();

    setVoiceRecorder(null);
    setIsRecording(false);
  };

  /**
   * This hook is triggered when we start the recording
   */
  React.useEffect(() => {
    if (!isRecording || !voiceRecorder) return;

    voiceRecorder.start();

    voiceRecorder.ondataavailable = ({ data }) => setContent(data);
  }, [isRecording, voiceRecorder]);

  /**
   * This hook will call our callback after finishing the record
   */
  React.useEffect(() => {
    if (isRecording || !content || !stream) return;

    onFinish({ id: stream.id, audio: content });

    setStream(null);
    setContent(null);
  }, [isRecording, content]);

  return (
    <Button
      type="button"
      variant="outline"
      size="xs"
      shape="circle"
      color="secondary"
      onClick={!isRecording ? onAudioClick : onStopRecording}
    >
      {!isRecording ? <MicrophoneIcon /> : 'Audio'}
    </Button>
  );
};

export default AudioRecorder;
