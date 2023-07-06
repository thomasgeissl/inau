import { Button } from "@mui/material";
import styled from "@emotion/styled";
import useStore from "../stores/control";
import Users from "./control/Users";

const Container = styled.ul``;
interface ControlProps {}
const Control: React.FC<ControlProps> = ({}) => {
  const publish = useStore((state) => state.publish);
  const questions = useStore((state) => state.questions);
  return (
    <Container>
        <Users></Users>
      {questions.map((question) => {
        return (
          <li key={`question-${question.uuid}`}>
            <Button
              onClick={() => {
                publish(question.uuid);
              }}
              variant="outlined"
            >
              {question.text}
            </Button>
          </li>
        );
      })}
    </Container>
  );
};

export default Control;
