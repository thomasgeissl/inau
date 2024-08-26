import { Box, Button } from "@mui/material";
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import DirectusFile from "../DirectusFile";
import { useState } from "react";
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
          <Box display={"flex"} flexDirection="column" gap={3} justifyContent={"center"} sx={{marginBottom: "24px"}}>
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
