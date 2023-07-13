import { Button } from "@mui/material";
import styled from "@emotion/styled";
import useStore from "../stores/control";
import { Link } from "react-router-dom";
import BarChartIcon from '@mui/icons-material/BarChart';

const Container = styled.div``;
const List = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;
interface ControlProps {}
const Actions: React.FC<ControlProps> = ({}) => {
  const publish = useStore((state) => state.publish);
  const questions = useStore((state) => state.questions);
  const responses = useStore((state) => state.responses);
  return (
    <Container>
      <List>
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
                        <BarChartIcon></BarChartIcon> 
                        ({responses[question.uuid].length})
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
      </List>
    </Container>
  );
};

export default Actions;
