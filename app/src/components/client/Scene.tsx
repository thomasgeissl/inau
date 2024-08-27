import { Box, Button, IconButton } from "@mui/material";
import {
  StarOutline,
  StarRate,
  StarRateOutlined,
  ThumbDown,
  ThumbUp,
} from "@mui/icons-material";
import DirectusFile from "../DirectusFile";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import useStore from "../../stores/client";

interface SceneProps {
  scene: any;
}

const Scene: React.FC<SceneProps> = ({ scene }) => {
  const publish = useStore((state) => state.publish);
  const [value, setValue] = useState<any>(null);

  const setOption = (option: any) => {
    setValue(option.key);
  };

  const [image, setImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      // onChange(name, priority, description, imageSrc);
    }
  }, [webcamRef, setImage]);

  return (
    <Box display={"flex"} flexDirection={"column"} height="100%">
      {scene?.text && (
        <Box dangerouslySetInnerHTML={{ __html: scene?.text }}></Box>
      )}
      {scene?.media && <DirectusFile file={scene.media}></DirectusFile>}
      <Box flex={1}></Box>
      <Box className="actions">
        {scene?.type === "bool" && (
          <Box display={"flex"} gap={3} justifyContent={"center"}>
            <Button
              variant={value === true ? "contained" : "outlined"}
              color="secondary"
              onClick={() => {
                setValue(true);
              }}
            >
              <ThumbUp></ThumbUp>
            </Button>
            <Button
              variant={value === false ? "contained" : "outlined"}
              color="secondary"
              onClick={() => {
                setValue(false);
              }}
            >
              <ThumbDown></ThumbDown>
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
            {scene.options?.map((option: any) => {
              return (
                <Button
                  variant={
                    value === option?.options_id?.key ? "contained" : "outlined"
                  }
                  fullWidth
                  color="secondary"
                  key={`option-${option?.options_id?.id}`}
                  onClick={() => {
                    setOption(option?.options_id);
                  }}
                >
                  {option?.options_id?.key}
                </Button>
              );
            })}
          </Box>
        )}
        {scene?.type === "rating" && (
          <Box
            display={"flex"}
            gap={3}
            justifyContent={"center"}
            sx={{ marginBottom: "24px" }}
          >
            {[1, 2, 3, 4, 5].map((rating) => {
              return (
                <IconButton
                  key={`star-${rating}`}
                  color={value >= rating ? "primary" : "secondary"}
                  onClick={() => {
                    setValue(rating);
                  }}
                >
                  {value < rating && <StarRateOutlined></StarRateOutlined>}
                  {value >= rating && <StarRate></StarRate>}
                </IconButton>
              );
            })}
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
                ></Webcam>
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
          </>
        )}
      </Box>
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
    </Box>
  );
};

export default Scene;
