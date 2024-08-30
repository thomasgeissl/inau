import _ from "lodash";
import { Box, BoxProps } from "@mui/material";
import ReactPlayer from "react-player";

interface DirectusFileProps extends BoxProps {
  file: any;
  playerRef?: any;
  onClose?: () => void;
}

const DirectusFile: React.FC<DirectusFileProps> = ({
  file,
  playerRef,
  onClose,
  ...props
}: DirectusFileProps) => {
  const { id, type } = file;

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={3}
      width={"100%"}
      padding={"12px"}
      {...props}
    >
      <Box display={"center"} justifyContent={"center"}>
        {file?.type?.startsWith("image") && (
          <img
            src={`${import.meta.env.VITE_CMS_BASEURL}/assets/${id}`}
            style={{ maxHeight: "180px" }}
          />
        )}
        {file?.type?.startsWith("video") && (
          <ReactPlayer
            ref={playerRef}
            url={`${import.meta.env.VITE_CMS_BASEURL}/assets/${id}`}
            style={{ maxWidth: "100%" }}
            muted
            playing={true}
            onEnded={() => {
              if (onClose) {
                onClose();
              }
            }}
            config={{
              file: {
                attributes: {
                  crossOrigin: "anonymous", // Set crossOrigin attribute
                },
              },
            }}
          ></ReactPlayer>
          //   <video controls style={{maxWidth: "100%"}} autoPlay muted>
          //     <source
          //       src={`${import.meta.env.VITE_CMS_BASEURL}/assets/${id}`}
          //       type={file.type}
          //     />
          //     Your browser does not support the video tag.
          //   </video>
        )}
      </Box>
    </Box>
  );
};

export default DirectusFile;
