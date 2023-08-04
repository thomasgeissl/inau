import { useEffect, useState } from "react";
import useStore from "../../../stores/control";
import _ from "lodash";
import { Button, IconButton, MenuItem, Select, TextField } from "@mui/material";
import styled from "@emotion/styled";
import { Question, types } from "../../../types/Question";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import { convertToHTML } from "draft-convert";
import { v4 } from "uuid";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { PlusOne } from "@mui/icons-material";

const Container = styled.div`
  padding: 16px;
  .editor {
    background-color: white;
    color: black;
  }
`;

interface AddQuestionProps {
  onQuestionAdded?: () => void;
}

const AddQuestion: React.FC<AddQuestionProps> = ({ onQuestionAdded }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [type, setType] = useState("YES_NO");
  const [yesLabel, setYesLabel] = useState("yes");
  const [noLabel, setNoLabel] = useState("no");
  const [labelMin, setLabelMin] = useState("negative");
  const [labelMax, setLabelMax] = useState("positive");
  const [wordCount, setWordCount] = useState(1);
  const [numberOfSelections, setNumberOfSelections] = useState(1);
  const [options, setOptions] = useState([] as string[]);
  const addQuestion = useStore((state) => state.addQuestion);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);
  return (
    <Container>
      <Select
        fullWidth
        value={type}
        onChange={(event) => setType(event.target.value)}
        color="primary"
      >
        {types.map((type) => {
          return (
            <MenuItem value={type} key={type}>
              {type}
            </MenuItem>
          );
        })}
      </Select>
      {isMounted && (
        <Editor
          editorState={editorState}
          wrapperClassName="wrapper"
          editorClassName="editor"
          onEditorStateChange={setEditorState}
        />
      )}

      {type === "YES_NO" && (
        <>
          <TextField
            label="yes label"
            color="primary"
            value={yesLabel}
            onChange={(event) => setYesLabel(event.target.value)}
          ></TextField>
          <TextField
            label="no label"
            value={noLabel}
            onChange={(event) => setNoLabel(event.target.value)}
          ></TextField>
        </>
      )}
      {type === "RATING" && (
        <>
          <TextField
            label="label min"
            color="primary"
            value={labelMin}
            onChange={(event) => setLabelMin(event.target.value)}
          ></TextField>
          <TextField
            label="label max"
            value={labelMax}
            onChange={(event) => setLabelMax(event.target.value)}
          ></TextField>
        </>
      )}
      {type === "TEXT" && (
        <>
          <TextField
            label="word count"
            color="primary"
            value={wordCount}
            onChange={(event) => setWordCount(parseInt(event.target.value))}
            type="number"
          ></TextField>
        </>
      )}
      {type === "MULTIPLE_CHOICE" && (
        <>
          <TextField
            label="number of selection"
            color="primary"
            value={numberOfSelections}
            onChange={(event) =>
              setNumberOfSelections(parseInt(event.target.value))
            }
            type="number"
          ></TextField>
          {options.map((option, index) => {
            return (
              <TextField
                key={`option-${index}`}
                label={`option ${index}`}
                color="primary"
                value={option}
                onChange={(event) => {
                  const newOptions = [...options];
                  newOptions[index] = event.target.value;
                  setOptions(newOptions);
                }}
              />
            );
          })}
          <IconButton onClick={() => setOptions([...options, ""])}>
            <PlusOne></PlusOne>
          </IconButton>
        </>
      )}

      <Button
        variant="outlined"
        fullWidth
        onClick={() => {
          let question: Question | null = null;
          if (type === "YES_NO") {
            question = {
              uuid: v4(),
              type, //: (type as typeof(questionTypes)),
              text: convertToHTML(editorState.getCurrentContent()),
              labelYes: yesLabel,
              labelNo: noLabel,
            };
          }
          if (type === "TEXT") {
            question = {
              uuid: v4(),
              type,
              text: convertToHTML(editorState.getCurrentContent()),
              wordCount,
            };
          }
          if (type === "RATING") {
            question = {
              uuid: v4(),
              type,
              text: convertToHTML(editorState.getCurrentContent()),
              labelMin,
              labelMax,
            };
          }
          if (type === "MULTIPLE_CHOICE") {
            question = {
              uuid: v4(),
              type,
              text: convertToHTML(editorState.getCurrentContent()),
              options,
              numberOfSelections,
            };
          }
          if (question) {
            addQuestion(question);
            if (onQuestionAdded) {
              onQuestionAdded();
            }
          }
        }}
      >
        save
      </Button>
    </Container>
  );
};

export default AddQuestion;
