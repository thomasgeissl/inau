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
const List = styled.ul`
  list-style-type: none;
`;

interface RunProps {}
const Run: React.FC<RunProps> = ({}) => {
  const users = useStore((state) => state.users);
  const index = useStore((state) => state.index);
  const setIndex = useStore((state) => state.setIndex);
  const next = useStore((state) => state.next);
  const previous = useStore((state) => state.previous);
  const questions = useStore((state) => state.questions);
  const question = questions[index];
  return (
    <Container>
      <Grid container sx={{ width: "100%", height: "100%" }}>
        <Grid item xs={12}>
          <Content>
            {question && <Question question={question} showActions={false} />}
          </Content>
          <Stack spacing={2} alignItems="center">
            <Pagination
              count={questions.length}
              color="primary"
              page={index + 1}
              variant="outlined"
              onChange={(event, value) => {
                setIndex(value - 1);
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Run;
