import { Box, IconButton } from "@mui/material";
import { Delete, Edit, Send } from "@mui/icons-material";
import styled from "@emotion/styled";
import useStore from "../../../stores/control";
import { Scene as QuestionType } from "../../../types/Scene";
import { useState } from "react";
interface QuestionProps {
  question: QuestionType;
}

const Container = styled(Box)`
  margin: 8px;
  padding: 16px;
  border-radius: 12px;
  border-color: rgb(64,64,64);
  border: 1px solid;
  margin-bottom: 16px;
`;

const Question: React.FC<QuestionProps> = ({ question }) => {
  const deleteQuestion = useStore((state) => state.deleteQuestion);
  const publish = useStore((state) => state.publish);
  const [hovered, setHovered] = useState(false);
  return (
    <Container
      flexDirection={"row"}
      display={"flex"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box flex={1}>
        {question.type}
        <br></br>
        {question?.text && <div dangerouslySetInnerHTML={{__html: question.text}}></div>}
      </Box>
      {hovered && (
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => publish(question.uuid)}
          >
            <Send></Send>
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={() => deleteQuestion(question.uuid)}
          >
            <Edit></Edit>
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={() => deleteQuestion(question.uuid)}
          >
            <Delete></Delete>
          </IconButton>
        </Box>
      )}
    </Container>
  );
};

export default Question;
