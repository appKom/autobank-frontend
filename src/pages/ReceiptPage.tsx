import Navbar from "../components/universal/Navbar";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { fetchCommittees } from "../api/baseAPI";
import { useAuth0 } from "@auth0/auth0-react";
import FileUpload from "../components/form/FileUpload";
import { fileToBase64 } from "../utils/fileutils";

import { submitReceipt } from "../api/formsAPI";

interface Committee {
    id: number;
    name: string;
}

interface Receipt {
    amount: number;
    committee_id: number;
    name: string;
    description: string;
    id: 0;
}

interface FormData {
    amount: number;
    committee_id: number;
    name: string;
    description: string;
    card_number?: string;
    account_number?: string;
    id: 0;
}

interface PaymentInformation {
    usedOnlineCard: boolean;
    accountnumber?: string;
    cardnumber?: string;
}
interface ReceiptRequestBody {
    receipt: Receipt;
    attachments: string[];
    receiptPaymentInformation?: PaymentInformation;
}


const ReceiptPage = () => {

    const [usedOnlineCard, setUsedOnlineCard] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);

    const [attachments, setAttachments] = useState<File[]>([]);

    const auth = useAuth0();
    const { getAccessTokenSilently } = auth;

    const { data, isError } = useQuery({
        queryKey: ["committees"],
        queryFn: () => fetchCommittees(getAccessTokenSilently),
    });

    const onFileChange = async (files: File[]) => {
        setAttachments([...files]);
        console.log(attachments)
    }

    const [formdata, setFormdata]: [FormData, any] = useState({ 
        amount: 0,
        committee_id: 0,
        name: "",
        description: "",
        id: 0,
        card_number: "",
        account_number: ""
    });

    const submitform = async () => {
        console.log(attachments)
        setDisableSubmit(true);
        const paymentInfo: PaymentInformation = {
            usedOnlineCard: usedOnlineCard,
            accountnumber: (usedOnlineCard) ? "" : formdata.account_number,
            cardnumber: (usedOnlineCard) ? formdata.card_number : ""
        }
        const receipt: Receipt = {
            amount: formdata.amount,
            committee_id: formdata.committee_id,
            name: formdata.name,
            description: formdata.description,
            id: 0
        }
        const body: ReceiptRequestBody = {
            receipt: formdata,
            attachments: await Promise.all([...attachments].map(async (file) => await fileToBase64(file))),
            receiptPaymentInformation: paymentInfo
        }
        const res: Response = await submitReceipt(getAccessTokenSilently, body);
        
        if (res.ok) {
            alert("Kvittering sendt inn!");
            // TODO: Fix with popup success message in home something
            window.location.href = "/?receiptsubmitted=true";


        } else {
            // TODO: Popup error message
            alert("Noe gikk galt, prøv igjen senere");
        }

        
        setDisableSubmit(false);
    }
    
 

    return (
        <div className="min-h-screen pb-[200px]">
         
            <div className="max-w-2xl ml-auto mr-auto">
                <div className="flex justify-center gap-[50px] mt-[60px]">
                    <h1 className="text-5xl text-white text-center self-center mb-auto mt-auto font-thin">Kvitteringsskjema</h1>
                    <img src={"../../../resources/images/receiptpageimage.png"} className="w-[130px] hidden md:flex " ></img>
                </div>
                <div className="mt-[30px]">
                    <h1 className="text-3xl text-white text-center self-center font-thin">Kvitteringsinformasjon</h1>
                    <h1 className="text-xl text-white text-center self-center mt-[10px] font-thin">Kort brukt til kjøpet</h1>
                </div>
                <div className="flex justify-center gap-5 mt-[10px] text-white mb-[10px]">
                    <div className="flex items-center gap-3">
                        <input
                            defaultChecked
                            onClick={() => setUsedOnlineCard(false)}
                            name="receiptcard"
                            className="cursor-pointer appearance-none border-white border-2 rounded-xl w-4 h-4 p-[0.05rem] checked:bg-white checked:border-white checked:bg-clip-content"
                            type="radio">
                        </input>

                        <label className="">Eget kort</label>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            onClick={() => setUsedOnlineCard(true)}
                            name="receiptcard"
                            className="cursor-pointer appearance-none border-white border-2 rounded-xl w-4 h-4 p-[0.05rem] checked:bg-white checked:border-white checked:bg-clip-content"
                            type="radio">
                        </input>
                        <label>Onlines bankkort</label>
                    </div>

                </div>
                <div className={`${usedOnlineCard ? "hidden" : ""} text-white`}>
                    <div className="flex justify-center gap-10">
                        <div className="flex-col w-[20rem]">
                            <p className="text-left tracking-wide">Kontonummer</p>
                            <input placeholder={"2345 XX XXXX"} className="text-black p-3 rounded w-full" onChange={
                                (e) => {
                                    setFormdata({ ...formdata, account_number: e.target.value });
                                }
                            }></input>
                        </div>
                        <div className="flex-col w-[20rem]">
                            <p className="text-left tracking-wide">Beløp</p>
                            <input placeholder={"530"} className="text-black p-3 rounded w-full" onChange={
                                (e) => {
                                    setFormdata({ ...formdata, amount: parseInt(e.target.value) });        
                                }
                            }></input>
                        </div>
                    </div>
                    <div className="flex justify-center gap-10 mt-[10px]">
                        <div className="flex-col w-[20rem]">
                            <p className="text-left tracking-wide">Anledning</p>
                            <input placeholder={"Arbeidskveld"} className="text-black p-3 rounded w-full" onChange={
                                (e) => {
                                    setFormdata({ ...formdata, name: e.target.value });
                                }
                            }></input>
                        </div>
                        <div className="flex-col w-[20rem]">
                            <p className="text-left tracking-wide">Ansvarlig enhet</p>
                            <select className="text-black p-3 rounded w-full"  onChange={
                                (e) => {
                                    setFormdata({ ...formdata, committee_id: parseInt(e.target.value) });
                                }
                            } >
                                <option value="None">Ingen</option>
                                {
                                    data && data.length ? data.map((committee: any) => {
                                        return <option key={committee.id} value={committee.id}>{committee.name}</option>
                                    }) : null
                                }
                            </select>

                        </div>
                    </div>

                </div>
                <div className={`${!usedOnlineCard ? "hidden" : ""} text-white`}>
                    <div className="flex justify-center gap-10">
                        <div className="flex-col w-[20rem]">
                            <p className="text-left tracking-wide">Kortinformasjon</p>
                            <input placeholder={"Kortnummer/Hvilken komite korter tilhører"} className="text-black p-3 rounded w-full" onChange={
                                (e) => {
                                    setFormdata({ ...formdata, card_number: e.target.value });
                                }
                            }></input>
                        </div>
                        <div className="flex-col w-[20rem]">
                            <p className="text-left tracking-wide">Beløp</p>
                            <input placeholder={"530"} className="text-black p-3 rounded w-full" onChange={
                                (e) => {
                                    setFormdata({ ...formdata, amount: parseInt(e.target.value) });
                                }
                            }></input>
                        </div>
                    </div>
                    <div className="flex justify-center gap-10 mt-[10px]">
                        <div className="flex-col w-[20rem]">
                            <p className="text-left tracking-wide">Anledning</p>
                            <input placeholder={"Arbeidskveld"} className="text-black p-3 rounded w-full" onChange={
                                (e) => {
                                    setFormdata({ ...formdata, name: e.target.value });
                                }
                            }></input>
                        </div>
                        <div className="flex-col w-[20rem]">
                            <p className="text-left tracking-wide">Ansvarlig enhet</p>
                       
                            <select className="text-black p-3 rounded w-full" onChange={
                                (e) => {
                                    setFormdata({ ...formdata, committee_id: parseInt(e.target.value) });
                                }
                            } >
                                     <option value="None">Ingen</option>
                                {
                                    data && data.length ? data.map((committee: any) => {
                                        return <option key={committee.id} value={committee.id}>{committee.name}</option>
                                    }) : null
                                }
                            </select>

                        </div>
                    </div>

                </div>
                <div className="text-white mb-[10px] mt-[10px]">
                    <h1 className="text-3xl text-white text-center self-center mt-[20px] font-thin mb-[10px]">Vedlegg/Kvitteringer</h1>
                    <p>Last opp et tydelig bilde/scan av kvitteringen. Husk at kvitteringen må være gyldig for at den skal godkjennes.
                        Er du usikker på om kvitteringen er gyldig? <a href="/hjelp/kvittering" className="text-green-400 underline">Se her</a></p>
                </div>
                <div className="flex-col ">
                    <p className="text-white w-full text-left text-l mb-[5px]" >Vedlegg</p>
                    <FileUpload onFileChange={onFileChange} />
                </div>
                <div className="flex-col mt-[20px]">
                    <p className="text-white w-full text-left text-l mb-[5px]" >Kommentarer</p>
                    <textarea name="" id="" className="w-full border-2 border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-[120px] bg-white" onChange={
                        (e) => {
                            setFormdata({ ...formdata, description: e.target.value });
                        }
                    }></textarea>
                </div>
                <div>
                    <button disabled={disableSubmit} className="p-3 bg-white rounded mt-[30px] hover:bg-gray-200" onClick={submitform}>Send skjema</button>
                </div>

            </div>

        </div>
    );
}

export default ReceiptPage;