import React from "react";
import NoteCard from "./NoteCard";
import {CssBaseline, Button, CircularProgress, Modal, Box} from "@mui/material";
import SuggestionList from "./SuggestionList";
import UserTextField from "./UserTextField";
import Suggestion from "./Suggestion";
import Note from "./Note";

const URL: string = "https://app-cqcqomtita-wl.a.run.app/"; // "http://127.0.0.1:5000/";

interface AppState {
    prompt: string
    notes: {[k: string]: Note} // Map of phrase (string) to array of Notes
    suggestions: {[k: string]: Suggestion[]} // Map of phrase (string) to array of Suggestions
    focus: string
    image: string
    modalOpen: boolean
    notesLoading: boolean
}

class App extends React.Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            prompt: "hi",
            notes: {},
            suggestions: {},
            focus: "",
            image: "",
            modalOpen: false,
            notesLoading: false,
        }
    }

    handlePromptAccept = async (text: string) => {
        await this.handleGenerate(text);
    }

    handleGenerate = async (prompt: string) => {
        this.setState({
            image: "",
            modalOpen: true
        });

        let formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("notes", JSON.stringify(this.state.notes));

        let response = await fetch(URL + "diverse-injection", {
            method: 'POST',
            body: formData
        });

        let image = await response.text();
        this.setState({
            image: image
        });
    }


    // handleIterate = async () => {
    //     let formData = new FormData();
    //     formData.append("prompt", this.state.prompt);
    //     formData.append("notes", JSON.stringify(this.state.notes));
    //
    //     let response = await fetch(URL + "iterate", {
    //         method: 'POST',
    //         body: formData
    //     });
    //
    //     let notes = {...this.state.notes};
    //     let suggestions = {...this.state.suggestions};
    //     for (let phrase in Object.keys(notes)) {
    //         notes[phrase].disabled = true;
    //     }
    //
    //     let new_suggestions: {[k: string]: Suggestion[]} = await response.json();
    //     for (let phrase in new_suggestions) {
    //         if (!Object.hasOwn(this.state.notes, phrase)) {
    //             this.state.notes[phrase] = {
    //                 phrase: phrase,
    //                 annotation: "",
    //                 disabled: false
    //             };
    //             suggestions[phrase] = new_suggestions[phrase];
    //         }
    //     }
    //
    //     this.setState({
    //         notes: {...this.state.notes},
    //         suggestions: {...this.state.suggestions},
    //         notesLoading: false
    //     });
    // }

    render() {
        return (
            <div className="root">
                <CssBaseline/>

                <UserTextField
                    placeholder="Enter prompt here..."
                    onAccept={this.handlePromptAccept}
                    sx={{width: 1}}
                />

                <Modal
                    open={this.state.modalOpen}
                    onClose={() => this.setState({modalOpen: false})}
                >
                    <Box sx={{
                        height: 0.5,
                        width: 0.5,
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        margin: "auto"
                    }}>
                        {this.state.image === "" && <CircularProgress sx={{
                            position: "absolute",
                            m: "auto",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0
                        }}/>}
                        {this.state.image !== "" && <img
                            src={this.state.image}
                            alt={this.state.prompt}
                            className="generated-img"
                            style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain"
                            }}
                        />}
                    </Box>
                </Modal>
            </div>
        );
    }
}

export default App;