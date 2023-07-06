import { Box, Button } from "@mui/material";
import styled from "@emotion/styled";
import { Question as QuestionType } from "../../types/Question";
import useStore from "../../stores/client";

interface QuestionProps {
  question: QuestionType;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const Actions = styled.div``;
const Text = styled.div`
  display: flex;
  margin-bottom: 24px;
`;
const Question: React.FC<QuestionProps> = ({ question }) => {
  const respond = useStore((state) => state.respond);
  return (
    <Container>
      <Text>{question?.text}</Text>
      <Actions>
        {question?.type === "RATING" && (
          <>
            {[0, 1, 2, 3, 4, 5].map((value) => {
              return (
                <Button
                  key={`star-${value}`}
                  onClick={() => {
                    respond(value);
                  }}
                >
                  {value}
                </Button>
              );
            })}
          </>
        )}
        {question?.type === "YES_NO" && (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                respond(true);
              }}
            >
              {question?.labelYes}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                respond(false);
              }}
            >
              {question?.labelNo}
            </Button>
          </>
        )}
      </Actions>
    </Container>
  );
};

export default Question;
