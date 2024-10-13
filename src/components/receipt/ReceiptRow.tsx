import { Receipt_Info } from "../../api/adminReceiptAPI";

interface ReceiptOverviewProps {
    receipt: Receipt_Info;
}

import { IoIosMail, IoIosCloseCircle, IoMdCheckmark } from "react-icons/io";






const ReceiptRow = ({ receipt }: ReceiptOverviewProps) => {
    return (
        <tr onClick={() => window.location.href=`/admin/kvittering/${receipt.receiptId}`} className="h-[100px] shadow-black border-violet-500 mb-5 ml-0">
            <td className="bg-green-200 flex items-center justify-center h-[100px] rounded-tl rounded-bl ">
              
                <div className="relative group">
                    {
                        receipt.latestReviewStatus == "APPROVED" ?
                            <IoMdCheckmark  color="green" className="text-3xl" /> :
                            receipt.latestReviewStatus == "DENIED" ?
                                <IoIosCloseCircle color="#DD0000" className="text-3xl" /> :
                                <IoIosMail color="#0000CC" className="text-3xl" />
                    }
                    <span className="absolute bottom-12 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        {receipt.latestReviewStatus == "APPROVED" ? 'Godkjent' :
                            receipt.latestReviewStatus == "DENIED" ? 'Avvist' :
                                'Ubesvart'}
                    </span>
                </div>
     
            </td>
            <td className="bg-green-200 text-left">{receipt.committeeName}</td>
            <td className="bg-green-200 text-left">{receipt.receiptName}</td>
            <td className="bg-green-200 text-left hidden md:table-cell">{receipt.paymentOrCard == "Payment" ? "Utlegg" : "Kort"}</td>
            <td className="bg-green-200 text-left hidden md:table-cell max-w-[150px] overflow-hidden">{receipt.receiptDescription}</td>
            <td className="bg-green-200 text-center w-[110px] rounded-tr rounded-br">
                {`${new Date(receipt.receiptCreatedAt).getDate()}.${new Date(receipt.receiptCreatedAt).getMonth() + 1} ${new Date(receipt.receiptCreatedAt).getFullYear()}`}
            </td>
        </tr>


    );
}

export default ReceiptRow;