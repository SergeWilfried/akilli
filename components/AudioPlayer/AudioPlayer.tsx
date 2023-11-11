import React from 'react';

interface IProps {
  audio: Blob;
  url: string | null;
}

const AudioPlayer: React.FC<IProps> = ({ audio, url }) => {
  const ref = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    if (ref && ref.current && audio) {
      ref.current.src = window.URL.createObjectURL(audio);
    }
  }, [ref, audio]);

  return <audio ref={ref} src={url ?? ''} autoPlay={false} controls />;
};

export default AudioPlayer;
