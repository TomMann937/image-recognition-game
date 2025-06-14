import express from "express";
import dotenv from "dotenv";
import { ClarifaiStub, grpc} from "clarifai-nodejs-grpc";

dotenv.config();

const router = express.Router();

const PAT = process.env.CLARIFAI_PAT;

const USER_ID = 'clarifai';
const APP_ID = 'main';
const MODEL_ID = 'general-image-detection';
const MODEL_VERSION_ID = '1580bb1932594c93b7e2e04456af7c6f';
// ! for testing only
// const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';


const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

const objectList = ["Headphones", "Pen", "Umbrella"];

router.get("/", async (req, res) => {

  try {
    const target = objectList[Math.floor(Math.random() * objectList.length)];
    res.status(200).json({ success: true, target: target });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
  
})

router.post("/", async (req, res) => {

  const base64Image = req.body.image;

   stub.PostModelOutputs(
      {
          user_app_id: {
              "user_id": USER_ID,
              "app_id": APP_ID
          },
          model_id: MODEL_ID,
          version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
          inputs: [
              {
                  data: {
                      image: {
                          base64: base64Image,
                      }
                  }
              }
          ]
      },
      metadata,
      (err, response) => {
          if (err) {
              throw new Error(err);
          }
  
          if (response.status.code !== 10000) {
              throw new Error("Post model outputs failed, status: " + response.status.description);
          }
  
          const regions = response.outputs[0].data.regions;
          const detected = [];
  
          regions.forEach(region => {
              // Accessing and rounding the bounding box values
              // const boundingBox = region.region_info.bounding_box;
              // const topRow = boundingBox.top_row.toFixed(3);
              // const leftCol = boundingBox.left_col.toFixed(3);
              // const bottomRow = boundingBox.bottom_row.toFixed(3);
              // const rightCol = boundingBox.right_col.toFixed(3);
  
              region.data.concepts.forEach(concept => {
                  // Accessing and rounding the concept value
                  const name = concept.name;
                  const value = concept.value.toFixed(4);
  
                  // console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
                  console.log(`${name}: ${value}`)
                  detected.push(name);
                  
              });
          });

      
        console.log(detected);
        res.status(200).json({ success: true, data: detected});
        
      }
  
  );

})


export default router;

