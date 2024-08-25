import {
  Box,
  Button,
} from "@mui/material";
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import DirectusFile from "../DirectusFile";

interface SceneProps {
  scene: any;
}

const Scene: React.FC<SceneProps> = ({ scene }) => {
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
            <Button variant="outlined" color="primary">
              <ThumbUp></ThumbUp>
            </Button>
            <Button variant="outlined" color="primary">
              <ThumbDown></ThumbDown>
            </Button>
          </Box>
        )}
        {scene?.type === "choice" && (
          <Box display={"flex"} gap={3} justifyContent={"center"}>
            {scene?.options?.options_id?.map((option: any)=>{
              return (
                <Button variant="outlined" color="primary" key={`option-${option?.options_id?.id}`}>
                  {option?.key}
                </Button>
              )
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Scene;
