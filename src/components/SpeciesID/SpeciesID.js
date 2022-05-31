import React, {useState, useEffect} from 'react';
import { getSpeciesIdentificationByPost,
    toggleIncrementSpeciesIdentificationRating,
    toggleDecrementSpeciesIdentificationRating,
    SpeciesIdentification, 
    addSpeciesIdentification,
    hasUserLikedSpeciesIdentification,
    hasUserDislikedSpeciesIdentification
} from '../../firebase/database';

import { isUserModerator, pinSpeciesIdentification, getSpeciesIdentificationPostMetaData } from '../../firebase/moderation';

import { getUsername } from '../../firebase/account';
import './SpeciesID.css'

function SpeciesID(props) {
    const [input, setInput] = useState("");
    const [list, setList] = useState(null);

    const [username, setUsername] = useState(null);
    const [moderator, setModerator] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    const [voteStyle, setVoteStyle] = useState(null);
    const [styleValid, setStyleValid] = useState(false);

    async function getList() {
        const m_dict = await getSpeciesIdentificationByPost(props.postid);
        if(m_dict === undefined) {
            setList(null);
            return;
        }
        const m_list = Array.from(m_dict.values());
        const m_meta = await getSpeciesIdentificationPostMetaData(props.postid);
        console.log(m_list);

        if(m_meta.pinnedSpeciesIdentification) {
            setIsPinned(true);
            const m_new_list = [m_list.find((guess => guess.id === m_meta.pinnedSpeciesIdentification)),
            ...m_list.filter(guess => guess.id !== m_meta.pinnedSpeciesIdentification)];
            setList(m_new_list)
        }
        else {
            setList(m_list)
        }      
    }

    async function getUserInfo() {
        const m_username = await getUsername();
        const m_mod = await isUserModerator();
        setUsername(m_username);
        setModerator(m_mod);
    }

    async function getVoteInfo() {
        if(list === null) {
            setStyleValid(false);
            return;
        }
        const m_style = await Promise.all(list.map(async (guess, i) => {
            const m_liked = await hasUserLikedSpeciesIdentification(props.postid, guess?.id);
            const m_disliked = await hasUserDislikedSpeciesIdentification(props.postid, guess?.id);
            if(m_liked) {
                return ({
                    up: "post-darkbutton",
                    num: "post-green",
                    down: null
                });
            }
            else if(m_disliked) {
                return ({
                    up: null,
                    num: "post-red",
                    down: "post-darkbutton"
                });
            }
            else {
                return ({
                    up: null,
                    num: null,
                    down: null
                });
            }
        }));
        setVoteStyle(m_style);
        
        setStyleValid(true);
    }

    useEffect(() => {
        getList();
        getUserInfo();
      }, []);

      useEffect(() => {
        getVoteInfo();
      }, [list]);

    return (
        <div class="speciesid-overall">
            <div id="speciesid-list">
                {list?.map((guess, i) => {
                    let highlight = function(){
                        if(i===0) {
                            if(isPinned || guess?.rating >= 3) {
                                return true;
                            }
                        }
                        return false;
                    }();
                    return (
                        <div id={highlight? "speciesid-highlight" : "nohighlight"}>
                            {highlight ? <p>OFFICIAL ANSWER</p> : null}
                            <table class="speciesid-element">
                                <tr>
                                    <td class="speciesid-td">
                                        <button class={styleValid ? voteStyle[i]?.up : null} onClick={() => {
                                                toggleIncrementSpeciesIdentificationRating(props.postid, guess?.id, username)
                                                .then((n) => {setTimeout(() => {getList()}, 500)})
                                            }}>&#11014;</button>
                                        <button class={styleValid ? voteStyle[i]?.down : null} onClick={() => {
                                            toggleDecrementSpeciesIdentificationRating(props.postid, guess?.id, username)
                                                .then((n) => {setTimeout(() => {getList()}, 500)})
                                            }}>&#11015;</button>
                                        {moderator ? 
                                            <button onClick={() => {
                                                alert("pinning " + guess?.id)
                                                pinSpeciesIdentification(props.postid, guess?.id, guess?.species)
                                                .then((n) => {setTimeout(() => {getList()}, 500)});
                                                }}>M&#10003;</button>
                                        :null}
                                    </td>
                                    <td class="speciesid-td">
                                        <span class={"speciesid-votes " + (styleValid? voteStyle[i]?.num : null)}>{guess?.rating}</span>
                                    </td>
                                    <td class="speciesid-td">
                                        <span class="speciesid-species">{guess?.species + guess?.text}</span>
                                        <br />
                                        <span class="speciesid-user">{"Submitted by " + guess?.author}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    );
                    
                })}
                
            </div>
            <form id="speciesid-input" onSubmit={(e) => {e.preventDefault()}}>
                <input id="speciesid-textbox" placeholder="Suggest Species..." 
                value={input} onChange={(e) => setInput(e.target.value)}/>
                <span id="speciesid-formpad"></span>
                <button onClick={() => {
                    if(!username) {
                        alert("You're not signed in! Sign in to suggest a species.");
                        return;
                    }
                    const si = new SpeciesIdentification(input, "", username, new Date().toISOString());
                    console.log(si);
                    setInput("");
                    addSpeciesIdentification(si, props.postid)
                    .then(() => {
                        setTimeout(() => {getList()}, 500)
                    });
                }}>Suggest</button>
            </form>
        </div>
    );
}

export default SpeciesID;