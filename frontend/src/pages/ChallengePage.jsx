import { useEffect, useRef, useState } from 'react'
import { Button, HStack } from '@chakra-ui/react';

const ChallengePage = () => {
  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const [hasPhoto, setHasPhoto] = useState(false);

  const getVideo = () => {

    navigator.mediaDevices.
    getUserMedia({
      video: {width: 1920, height: 1080 }
    })
    .then(stream => {
      let video = videoRef.current;
      video.srcObject = stream;
      video.play()
    })
    .catch(err => {
      console.error(err);
    })
  }

  const takePhoto = () => {
    console.log("taking photo");
    const width = 828;
    const height = width / (16/9);

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    setHasPhoto(true);
  }

  const retakePhoto = () => {
    let photo = photoRef.current;
    let ctx = photo.getContext('2d');

    ctx.clearRect(0, 0, photo.width, photo.height);

    setHasPhoto(false);
  }

  const handleSubmit = () => {
    // TODO 
  }

  useEffect(() => {
    getVideo();
  }, [] )

  return (
    <div className='relative'>
        <video className='rounded-lg w-full'
        ref={videoRef}
        style={{ display: hasPhoto ? 'none' : 'block'}}
        ></video>

        <canvas
        className='rounded-lg w-full'
        ref={photoRef}
        style={{ display: hasPhoto ? 'block' : 'none'}}
        ></canvas>

        {!hasPhoto ? (
          <div className='absolute bottom-14 left-1/2 transform -translate-x-1/2 z-10'
          >
          <Button onClick={takePhoto}>SNAP</Button>
          </div>
        ) : (
          <div 
          className='absolute bottom-14 left-1/2 transform -translate-x-1/2 z-10 flex gap-4'
          >
            <Button onClick={retakePhoto}>RETAKE</Button>
            <Button onClick={handleSubmit}>SUBMIT</Button>
          </div>
        )}
    </div>
  )
}

export default ChallengePage