import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import styled from "@emotion/styled";
import { Question as QuestionType } from "../../types/Question";
import useStore from "../../stores/client";
import { useState } from "react";

interface QuestionProps {
  question: QuestionType;
  showActions: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const Content = styled.div`
  flex: 1;
  padding: 64px;
`;
const ImageContainer = styled.div`
  text-align: center;
  img {
    max-width: 80%;
    max-height: 50vh;
  }
  margin-bottom: 64px;
`;
const Actions = styled.div`
  display: flex;
  gap: 24px;
  padding: 64px;
  align-items: center;
  justify-content: center;
`;
const Text = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  text-align: center;
  font-size: 24px;
`;

const List = styled.ul`
  list-style-type: none;
  li {
    float: left;
  }
`;
const Question: React.FC<QuestionProps> = ({ question, showActions }) => {
  const respond = useStore((state) => state.respond);
  const [text, setText] = useState("");
  const [selectedOption, setSelectionOption] = useState("");
  const [selectedOptions, setSelectionOptions] = useState([] as string[]);
  return (
    <Container>
      <Content>
        {question.img && (
          <ImageContainer>
            <img src={question.img}></img>
          </ImageContainer>
        )}
        {question?.text && <Text dangerouslySetInnerHTML={{__html: question?.text}}></Text>}
      </Content>
      {showActions && (
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
                    variant="outlined"
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
              <TextField
                fullWidth
                value={text}
                onChange={(event) => setText(event.target.value)}
                sx={{ color: "white" }}
              ></TextField>
              <Button onClick={() => respond(text)}>send</Button>
            </>
          )}
          {question?.type === "MULTIPLE_CHOICE" && (
            <>
              {question?.numberOfSelections > 1 && (
                <>
                  <List>
                    {question?.options.map((option, index) => {
                      return (
                        <li key={`option-${index}`}>
                          <FormControlLabel
                            label={option}
                            value={option}
                            control={
                              <Checkbox
                                checked={selectedOptions.includes(option)}
                                onChange={(event) => {
                                  if (selectedOptions.includes(option)) {
                                    setSelectionOptions(
                                      selectedOptions.filter(
                                        (item) => item !== option
                                      )
                                    );
                                  } else {
                                    setSelectionOptions([
                                      ...selectedOptions,
                                      option,
                                    ]);
                                  }
                                }}
                              />
                            }
                          />
                        </li>
                      );
                    })}
                  </List>
                  <Button variant="outlined" onClick={() => respond(selectedOptions)}>send</Button>
                </>
              )}
              {question?.numberOfSelections === 1 && (
                <>
                  <RadioGroup
                    row
                    value={selectedOption}
                    onChange={(event) => setSelectionOption(event.target.value)}
                  >
                    {question?.options.map((option, index) => {
                      return (
                        <FormControlLabel
                          key={`option-${index}`}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      );
                    })}
                  </RadioGroup>
                  <Button variant="outlined" onClick={() => respond(selectedOption)}>send</Button>
                </>
              )}
            </>
          )}
        </Actions>
      )}
    </Container>
  );
};

export default Question;
