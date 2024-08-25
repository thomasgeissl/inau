import { Box, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";
import styled from "@emotion/styled";
import { useState } from "react";

interface UserProps {
  uuid: string;
}

const Container = styled(Box)`
  margin: 8px;
  padding: 16px;
`;

const User: React.FC<UserProps> = ({ uuid }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Container
      flexDirection={"row"}
      display={"flex"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box flex={1}>
        {uuid}
      </Box>
      {hovered && (
        <Box>
          <IconButton
            size="small"
            color="primary"
          >
            <Send></Send>
          </IconButton>
        </Box>
      )}
    </Container>
  );
};

export default User;
