import { Box, IconButton } from "@mui/material";
import useStore from "../../../stores/control";
import { Question as QuestionType } from "../../../types/Question";
import { Delete, Edit } from "@mui/icons-material";
import { useState } from "react";
interface QuestionProps {
  question: QuestionType;
}

const Question: React.FC<QuestionProps> = ({ question }) => {
  const deleteQuestion = useStore((state) => state.deleteQuestion);
  const [hovered, setHovered] = useState(false);
  return (
    <Box
      flexDirection={"row"}
      display={"flex"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      border={"1px solid"}
      sx={{ margin: "8px", padding: "8px" }}
    >
      <Box flex={1}>
        {question.type}
        {question.text}
      </Box>
      {hovered && (
        <Box>
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
    </Box>
  );
};

export default Question;
