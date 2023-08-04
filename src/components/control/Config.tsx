import useStore from "../../stores/control";
import { useParams } from "react-router-dom";
import { Box, Button, IconButton } from "@mui/material";
import styled from "@emotion/styled";
import { Add, FileDownload, FileUpload } from "@mui/icons-material";
import AddQuestion from "./config/AddQuestion";
import Question from "./config/Question";
import { useState } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const Content = styled.div`
  flex: 1;
  overflow-y: scroll;
`;
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
  const questions = useStore((state) => state.questions);
  const exportQuestions = useStore((state) => state.export);
  const importQuestions = useStore((state) => state.import);
  const [addingQuestion, setAddingQuestion] = useState(false);

  return (
    <Container>
      <Actions>
        <Spacer></Spacer>
        <IconButton onClick={() => importQuestions()} color="primary">
          <FileDownload></FileDownload>
        </IconButton>
        <IconButton onClick={() => exportQuestions()} color="primary">
          <FileUpload></FileUpload>
        </IconButton>
      </Actions>
      <Content>
        <Questions>
          {questions.map((question, index) => (
            <li key={question.uuid}>
              <Question question={question}></Question>
            </li>
          ))}
        </Questions>
      </Content>
      <div>
        {addingQuestion && (
          <AddQuestion
            onQuestionAdded={() => setAddingQuestion(false)}
          ></AddQuestion>
        )}
        {!addingQuestion && (
          <FooterActions>
            <IconButton color="primary" onClick={() => setAddingQuestion(true)}>
              <Add></Add>
            </IconButton>
          </FooterActions>
        )}
      </div>
    </Container>
  );
};

export default Config;
