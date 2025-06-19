import { useEffect, useRef, useState } from "react";
import { Dialog, Button, Text, Field, Input } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useLeaderboardStore } from "../store/leaderboard";
import { useNavigate } from "react-router-dom";


const ChallengePage = () => {
  const { createLeaderboardEntry } = useLeaderboardStore();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const [hasPhoto, setHasPhoto] = useState(false);
  const [item, setItem] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(1 * 60 * 1000);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("")

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
        title: "Item found",
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

  const getFormattedTime = (milliseconds) => {
    if (milliseconds <= 0 ) return "0:00"

    let total_seconds = parseInt(Math.floor(milliseconds / 1000));
    let minutes = parseInt(Math.floor(total_seconds / 60));

    let seconds = parseInt(total_seconds % 60);

    let formatted_seconds = (seconds <= 9 ? '0' + seconds : seconds);

    return `${minutes}:${formatted_seconds}`
  }

  const handleSubmitScore = async () => {
    const leaderboardEntry = {name: name, score: score};
    
    const { success, message } = await createLeaderboardEntry(leaderboardEntry);

    navigate("/");
  }


  useEffect(() => {
    getVideo();
    getItem();
  }, []);

  useEffect(() => {
    if (time <= 0) {
      setOpen(true)
    }
    else {
      setTimeout(() => {
        setTime(time - 1000);
      }, 1000)
    }
  }, [time])

  return (
    <div className="relative">
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 flex gap-4">
        <Text className=" bg-gray-800 bg-opacity-25 rounded-2xl " 
        px={5}
        py={2}
        fontFamily={"sans-serif"}
        fontWeight={"semibold"}
        >
          Time: {getFormattedTime(time)}</Text>

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

      <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>Submit Score</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body> 
              <Text
              pb={4}
              fontWeight={"semibold"}
              fontSize={"xl"}
              >Final Score: {score}</Text>
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input 
                placeholder="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}/>
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Button onClick={handleSubmitScore}>Submit</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </div>

  );
};

export default ChallengePage;
