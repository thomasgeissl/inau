import { useEffect } from "react";
import styled from "@emotion/styled";
import useStore from "../../stores/control";
import { Button, Grid, Stack } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Question from "../client/Question";

const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
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
  const questions = useStore((state) => state.scenes);
  const responses = useStore((state) => state.responses);
  const init = useStore((state) => state.init);
  const question = questions[index];
  const responsesForQuestion = responses[question.uuid];
  useEffect(() => {
    init()
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
            {responsesForQuestion && (
              <div style={{ flexGrow: 1 }}>
                <Button variant="outlined">
                  {responsesForQuestion.length} responses
                </Button>
              </div>
            )}
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
