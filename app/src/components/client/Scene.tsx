import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import { StarRate, StarRateOutlined, ThumbDown, ThumbUp } from "@mui/icons-material";
import DirectusFile from "../DirectusFile";
import Webcam from "react-webcam";
import useStore from "../../stores/client";

interface SceneProps {
  scene: any;
}

const Scene: React.FC<SceneProps> = ({ scene }) => {
  const publish = useStore((state) => state.publish);
  const setScene = useStore((state) => state.setScene);
  const [value, setValue] = useState<any>(null);
  const [averageColor, setAverageColor] = useState<string>("transparent");
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);

  const setOption = (option: any) => {
    setValue(option.key);
  };

  const captureFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context && videoRef.current.getInternalPlayer()?.readyState >= 3) {
        if(videoRef.current.getInternalPlayer().videoWidth < 100){
          return
        }
        canvasRef.current.width = videoRef.current.getInternalPlayer().videoWidth;
        canvasRef.current.height = videoRef.current.getInternalPlayer().videoHeight;
        context.drawImage(videoRef.current.getInternalPlayer(), 0, 0, canvasRef.current.width, canvasRef.current.height);

        const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        const data = imageData.data;
        const length = data.length;

        let rTotal = 0, gTotal = 0, bTotal = 0;

        for (let i = 0; i < length; i += 4) {
          rTotal += data[i];
          gTotal += data[i + 1];
          bTotal += data[i + 2];
        }

        const pixelCount = length / 4;
        const rAvg = Math.round(rTotal / pixelCount);
        const gAvg = Math.round(gTotal / pixelCount);
        const bAvg = Math.round(bTotal / pixelCount);

        setAverageColor(`rgb(${rAvg}, ${gAvg}, ${bAvg})`);
      }
    }
  }, []);

  useEffect(() => {
    if (scene?.media && videoRef.current) {
      captureFrame();
      const intervalId = setInterval(captureFrame, 300); // Capture frame every 300ms
      return () => clearInterval(intervalId); // Cleanup on unmount or when media changes
    }
  }, [scene?.media, captureFrame]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
    }
  }, [webcamRef, setImage]);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      height="100%"
      sx={{
        animation: "fadeIn 1s ease-in-out",
        backgroundColor: scene?.type === "media" ? averageColor : "transparent",
        "@keyframes fadeIn": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      }}
    >
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      {scene?.text && (
        <Box
          dangerouslySetInnerHTML={{ __html: scene?.text }}
          sx={{ animation: "fadeIn 3s ease-in-out", fontSize: "24px" }}
        ></Box>
      )}
      {scene?.media && (
        <DirectusFile
          file={scene.media}
          onClose={() => setScene(null)}
          sx={{ animation: "fadeIn 1s ease-in-out" }}
          playerRef={videoRef} // Pass the videoRef to DirectusFile
        />
      )}
      <Box flex={1}></Box>
      <Box className="actions" sx={{ animation: "fadeIn 1s ease-in-out" }}>
        {scene?.type === "bool" && (
          <Box display={"flex"} gap={3} justifyContent={"center"}>
            <Button
              variant={value === true ? "contained" : "outlined"}
              color="secondary"
              onClick={() => {
                setValue(true);
              }}
            >
              <ThumbUp />
            </Button>
            <Button
              variant={value === false ? "contained" : "outlined"}
              color="secondary"
              onClick={() => {
                setValue(false);
              }}
            >
              <ThumbDown />
            </Button>
          </Box>
        )}
        {scene?.type === "choice" && (
          <Box
            display={"flex"}
            flexDirection="column"
            gap={3}
            justifyContent={"center"}
            sx={{ marginBottom: "24px" }}
          >
            {scene.options?.map((option: any) => (
              <Button
                variant={value === option?.options_id?.key ? "contained" : "outlined"}
                fullWidth
                color="secondary"
                key={`option-${option?.options_id?.id}`}
                onClick={() => {
                  setOption(option?.options_id);
                }}
              >
                {option?.options_id?.key}
              </Button>
            ))}
          </Box>
        )}
        {scene?.type === "rating" && (
          <Box
            display={"flex"}
            gap={3}
            justifyContent={"center"}
            sx={{ marginBottom: "24px" }}
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <IconButton
                key={`star-${rating}`}
                color={value >= rating ? "primary" : "secondary"}
                onClick={() => {
                  setValue(rating);
                }}
              >
                {value < rating && <StarRateOutlined />}
                {value >= rating && <StarRate />}
              </IconButton>
            ))}
          </Box>
        )}
        {scene.type === "photo" && (
          <>
            {(image === "" || !image) && (
              <Box display={"flex"} flexDirection={"column"} gap={3}>
                <Webcam
                  ref={webcamRef}
                  width={"100%"}
                  videoConstraints={{
                    facingMode: "environment",
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    capture();
                  }}
                  color="secondary"
                >
                  Take a photo
                </Button>
              </Box>
            )}
            {image && image !== "" && (
              <Box display={"flex"} gap={3} flexDirection="column">
                <img src={image} height={"auto"} width={"100%"} />
                <Button variant="outlined" onClick={() => setImage(null)}>
                  retake
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
      {scene.type !== "media" && (
        <Button
          color="primary"
          variant="contained"
          sx={{ marginTop: "24px" }}
          onClick={() => {
            publish(value);
            setValue(null);
          }}
        >
          submit
        </Button>
      )}
    </Box>
  );
};

export default Scene;
