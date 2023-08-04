import { useEffect } from "react";
import styled from "@emotion/styled";
import useStore from "../../stores/control";
import { Grid, Stack } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Question from "../client/Question";

const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
`;
const Content = styled.div`
  text-align: center;
  flex: 1;
`;
const Footer = styled.div`
  padding: 16px;
`;

interface RunProps {}
const Run: React.FC<RunProps> = ({}) => {
  const index = useStore((state) => state.index);
  const setIndex = useStore((state) => state.setIndex);
  const questions = useStore((state) => state.questions);
  const question = questions[index];
  useEffect(() => {
    setIndex(0);
  }, []);
  return (
    <Container>
      <Grid container sx={{ width: "100%", height: "100%" }}>
        <Grid
          item
          xs={12}
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Content className="content">
            {question && <Question question={question} showActions={false} />}
          </Content>
          <Footer>
            <Stack spacing={2} alignItems="center">
              <Pagination
                count={questions.length}
                color="primary"
                page={index + 1}
                variant="outlined"
                onChange={(_, value) => {
                  setIndex(value - 1);
                }}
              />
            </Stack>
          </Footer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Run;
