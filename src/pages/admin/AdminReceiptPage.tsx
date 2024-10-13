import React, { useState } from "react";
import Button from "../../components/universal/Button";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchAllReceipts, Receipt_Info } from "../../api/adminReceiptAPI";
import { useQuery } from "@tanstack/react-query";
import ReceiptRow from "../../components/receipt/ReceiptRow";
import { fetchCommittees, Committee } from "../../api/baseAPI";
import { Dropdown } from "flowbite-react";

const AdminReceiptPage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [receipts, setReceipts] = useState<Receipt_Info[]>([]);
  const [committees, setCommittees] = useState<Committee[]>();
  const [selectedCommittee, setSelectedCommittee] = useState<String>();

  const { data: receiptData, isError } = useQuery({
    queryKey: ["receipts_admin"],
    queryFn: () => fetchAllReceipts(getAccessTokenSilently, 0, 10),
  });

  const { data: committeeData } = useQuery({
    queryKey: ["committees"],
    queryFn: () => fetchCommittees(getAccessTokenSilently),
  });

  const filteredReceipts = selectedCommittee
    ? receiptData?.filter(
        (receipt) => receipt.committeeName === selectedCommittee
      )
    : receiptData;

  return (
    <div className="w-full flex-row p-5">
      <div className="w-full flex flex-row justify-between items-center">
        <input name="search"></input>
        <Dropdown label={selectedCommittee}>
          {committeeData &&
            committeeData?.map((committee: Committee) => (
              <Dropdown.Item
                key={committee.id}
                onClick={() => setSelectedCommittee(committee.name)}
              >
                {committee.name}
              </Dropdown.Item>
            ))}
        </Dropdown>
      </div>

      <table className="w-full border-separate border-spacing-y-3 max-w-[1100px] ml-auto mr-auto">
        <thead>
          <tr>
            <th></th>
            <th className="text-left text-white text-xl font-normal">Komité</th>
            <th className="text-left text-white text-xl font-normal">
              Anledning
            </th>
            <th className="text-left text-white text-xl font-normal hidden md:table-cell">
              Type
            </th>
            <th className="text-left text-white text-xl font-normal hidden md:table-cell">
              Kommentar
            </th>
            <th className="text-middle w-[110px] text-white text-xl font-normal">
              Dato
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredReceipts &&
            filteredReceipts.map((receipt) => (
              <ReceiptRow key={receipt.receiptId} receipt={receipt} />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReceiptPage;
