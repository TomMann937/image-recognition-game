import { useEffect, useRef, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";

const ChallengePage = () => {
  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const [hasPhoto, setHasPhoto] = useState(false);
  const [item, setItem] = useState("");
  const [score, setScore] = useState(0);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 1920, height: 1080 },
      })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const takePhoto = () => {
    const width = 828;
    const height = width / (16 / 9);

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);
    setHasPhoto(true);
  };

  const retakePhoto = () => {
    let photo = photoRef.current;
    let ctx = photo.getContext("2d");

    ctx.clearRect(0, 0, photo.width, photo.height);

    setHasPhoto(false);
  };

  const getItem = async () => {
    const res = await fetch("/api/recognition");
    const data = await res.json();
    setItem(data.target);
    console.log(data.target);
  };

  const handleSubmit = async () => {
    let photo = photoRef.current;
    let base64Image = photo.toDataURL("image/jpeg", 0.8);

    const base64String = base64Image.split(",")[1];

    const jsonBody = { image: base64String };
    // console.log(jsonBody.image);

    const res = await fetch("/api/recognition", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonBody),
    });
    const data = await res.json();
    const items = data.data;
    console.log(items);

    if (items.includes(item)) {
      setScore(score + 1);
      getItem();
      toaster.create({
        descirption: "Item found",
        titl: "Item found",
        type: "success",
        closable: true
      })
    } else {
      toaster.create({
        descirption: "Item not found",
        title: "Item not found - try again",
        type: "error",
        closable: true
      })
    }
    setHasPhoto(false);
  };

  useEffect(() => {
    getVideo();
    getItem();
  }, []);

  return (
    <div className="relative">
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 flex gap-4">
        <Text className=" bg-gray-800 bg-opacity-25 rounded-2xl " 
        px={5}
        py={2}
        fontFamily={"sans-serif"}
        fontWeight={"semibold"}
        >
          Time:</Text>

        <Text className=" bg-gray-800 bg-opacity-25 rounded-2xl " 
        px={5}
        py={2}
        fontFamily={"sans-serif"}
        fontWeight={"semibold"}
        >
          Target item: {item}</Text>
        <Text className=" bg-gray-800 bg-opacity-25 rounded-2xl " 
        px={5}
        py={2}
        fontFamily={"sans-serif"}
        fontWeight={"semibold"}
        >
          Score: {score}</Text>
      </div>

      <video
        className="rounded-2xl w-full"
        ref={videoRef}
        style={{ display: hasPhoto ? "none" : "block" }}
      ></video>

      <canvas
        className="rounded-2xl w-full"
        ref={photoRef}
        style={{ display: hasPhoto ? "block" : "none" }}
      ></canvas>

      {!hasPhoto ? (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <Button onClick={takePhoto}>Snap</Button>
        </div>
      ) : (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex gap-4">
          <Button onClick={retakePhoto}>Retake</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      )}
      <Toaster />
    </div>

  );
};

export default ChallengePage;
