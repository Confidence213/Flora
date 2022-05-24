import React, {useState, useEffect} from 'react';
import { getSpeciesIdentificationByPost,
    incrementSpeciesIdentificationRating,
    decrementSpeciesIdentificationRating,
    SpeciesIdentification, 
    addSpeciesIdentification} from '../../firebase/database';
import './SpeciesID.css'

function SpeciesID(props) {
    const [input, setInput] = useState("");
    const [list, setList] = useState(null);

    async function getList() {
        const m_list = await getSpeciesIdentificationByPost(props.postid);
        console.log(Array.from(m_list.values()));
        if(m_list === undefined) {
            setList(null);
        }
        else {
            setList(Array.from(m_list.values()));
        }
    }

    useEffect(() => {
        getList();
      }, []);

    let moderator = true;
    return (
        <div class="speciesid-overall">
            <div id="speciesid-list">
                {list?.map((guess, i) => {
                    let highlight = i === 0;
                    return (
                        <div id={highlight? "speciesid-highlight" : "nohighlight"}>
                            {highlight ? <p>BEST ANSWER</p> : null}
                            <table class="speciesid-element">
                                <tr>
                                    <td class="speciesid-td">
                                        <button onClick={() => {
                                                incrementSpeciesIdentificationRating(props.postid, guess?.id)
                                                .then((n) => {setTimeout(() => {getList()}, 500)})
                                            }}>&#11014;</button>
                                        <button onClick={() => {
                                            decrementSpeciesIdentificationRating(props.postid, guess?.id)
                                                .then((n) => {setTimeout(() => {getList()}, 500)})
                                            }}>&#11015;</button>
                                        {moderator ? 
                                            <button onClick={() => 
                                                {dummyModerator(props.postid, guess?.id);
                                                }}>M&#10003;</button>
                                        :null}
                                    </td>
                                    <td class="speciesid-td">
                                        <span class="speciesid-votes">{guess?.rating}</span>
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
                    const si = new SpeciesIdentification(input, "", "changeme", new Date().toISOString());
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

function dummyModerator(postid, i) {
    console.log("i overrode");
}

export default SpeciesID;