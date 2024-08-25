import _ from "lodash";
import {
  Box,
  BoxProps,
} from "@mui/material";
// import { useEffect, useState } from "react";
// import axios from "axios";
interface DirectusFileProps extends BoxProps {
  file: any;
}

const DirectusFile: React.FC<DirectusFileProps> = ({
  file,
  ...props
}: DirectusFileProps) => {
  const { id, type } = file;
//   const [data, setData] = useState<any>(null);
//   useEffect(() => {
//     axios
//       .get(`${import.meta.env.VITE_CMS_BASEURL}/files/${id}`)
//       .then((response) => {
//         setData(response.data);
//       })
//       .catch((error) => {});
//   }, [id, setData]);

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
          <img src={`${import.meta.env.VITE_CMS_BASEURL}/assets/${id}`}
            style={{ maxHeight: "180px" }}
          ></img>
        )}
      </Box>
    </Box>
  );
};

export default DirectusFile;
