import useStore from "../../stores/control";
import { useParams } from "react-router-dom";
import { Box, Button, IconButton } from "@mui/material";
import styled from "@emotion/styled";
import {
  Add,
  FileDownload,
  FileUpload,
} from "@mui/icons-material";
import AddQuestion from "./AddQuestion";
import Question from "./config/Question";

const Questions = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;
const Actions = styled.div`
  display: flex;
`;
const Spacer = styled.div`
  flex: 1;
`;
const FooterActions = styled.div`
  display: flex;
  justify-content: center;
`;

interface ResultProps {}

const Config: React.FC<ResultProps> = ({}) => {
  const responses = useStore((state) => state.responses);
  const questions = useStore((state) => state.questions);
  const exportQuestions = useStore((state) => state.export);
  const importQuestions = useStore((state) => state.import);
  const uuid = useParams().uuid ?? "";
  const question = questions.find((question) => question.uuid === uuid);

  return (
    <>
      <Actions>
        <Spacer></Spacer>
        <IconButton onClick={() => importQuestions()} color="primary">
          <FileDownload></FileDownload>
        </IconButton>
        <IconButton onClick={() => exportQuestions()} color="primary">
          <FileUpload></FileUpload>
        </IconButton>
      </Actions>
      <Questions>
        {questions.map((question, index) => (
          <li key={question.uuid}>
            <Question question={question}></Question>
          </li>
        ))}
      </Questions>
      <AddQuestion></AddQuestion>
      <FooterActions>
        <IconButton color="primary">
          <Add></Add>
        </IconButton>
      </FooterActions>
    </>
  );
};

export default Config;
