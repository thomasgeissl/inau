import { Button } from "@mui/material";
import styled from "@emotion/styled";
import useStore from "../stores/control";
import Users from "./control/Users";
import { Link } from "react-router-dom";

const Container = styled.ul``;
interface ControlProps {}
const Control: React.FC<ControlProps> = ({}) => {
  const publish = useStore((state) => state.publish);
  const questions = useStore((state) => state.questions);
  const responses = useStore((state) => state.responses);
  return (
    <Container>
      <Users></Users>
      {questions.map((question) => {
        return (
          <li key={`question-${question.uuid}`}>
            <>
              <Button
                onClick={() => {
                  publish(question.uuid);
                }}
                variant="outlined"
              >
                {question.text}
              </Button>
              {
                responses[question.uuid] &&
                  responses[question.uuid].length > 0 && (
                    <Link to={`/control/result/${question.uuid}`}>
                      results ({responses[question.uuid].length})
                    </Link>
                  )
                //   <Button
                //   onClick={() => {
                //     publish(question.uuid);
                //   }}
                //   variant="outlined"
                // >
                //   results ({responses[question.uuid].length})
                // </Button>
              }
            </>
          </li>
        );
      })}
    </Container>
  );
};

export default Control;
