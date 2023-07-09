import { Box, Button, TextField } from "@mui/material";
import styled from "@emotion/styled";
import { Question as QuestionType } from "../../types/Question";
import useStore from "../../stores/client";
import { useState } from "react";

interface QuestionProps {
  question: QuestionType;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const ImageContainer = styled.div`
text-align: center;
img{
  max-width: 80%;;
}
`;
const Actions = styled.div``;
const Text = styled.div`
  display: flex;
  margin-bottom: 24px;
`;
const Question: React.FC<QuestionProps> = ({ question }) => {
  const respond = useStore((state) => state.respond);
  const [text, setText] = useState("")
  return (
    <Container>
      {question.img && <ImageContainer><img src={question.img}></img></ImageContainer>}
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
        {question?.type === "TEXT" && (
          <>
          <TextField value={text} onChange={(event)=>setText(event.target.value)}></TextField>
          <Button onClick={()=>respond(text)}>send</Button>
          </>
        )}
      </Actions>
    </Container>
  );
};

export default Question;
