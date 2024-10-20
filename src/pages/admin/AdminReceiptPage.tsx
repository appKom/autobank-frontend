import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchAllReceipts, Receipt_Info } from "../../api/adminReceiptAPI";
import { useQuery } from "@tanstack/react-query";
import { fetchCommittees, Committee } from "../../api/baseAPI";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ReceiptTable from "../../components/receipt/ReceiptTable";

const AdminReceiptPage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [receipts, setReceipts] = useState<Receipt_Info[]>([]);
  const [selectedCommittee, setSelectedCommittee] = useState<String>();
  const [receiptStatus, setReceiptStatus] = useState<String>();
  const [searchTerm, setSearchTerm] = useState<String>();

  const { data: receiptData, isError } = useQuery({
    queryKey: ["receipts_admin"],
    queryFn: () => fetchAllReceipts(getAccessTokenSilently, 0, 10),
  });

  const { data: committeeData } = useQuery({
    queryKey: ["committees"],
    queryFn: () => fetchCommittees(getAccessTokenSilently),
  });

  // Filter receipts based on selected committee and receipt status
  const filteredReceipts = receiptData
    ?.filter((receipt) =>
      selectedCommittee ? receipt.committeeName === selectedCommittee : true
    )
    ?.filter((receipt) => {
      if (receiptStatus === "Active") {
        return receipt.latestReviewStatus === null; // Show null status reviews
      } else if (receiptStatus === "History") {
        return (
          receipt.latestReviewStatus === "APPROVED" ||
          receipt.latestReviewStatus === "DENIED"
        );
      }
      return true; // Show all if no status is selected
    })
    ?.filter((receipt) => {
      if (searchTerm) {
        return receipt.receiptName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else {
        return true;
      }
    });

  const handleSetStatusHistory = () => {
    setReceiptStatus("History");
  };

  const handleSetStatusActive = () => {
    setReceiptStatus("Active");
  };

  return (
    <div className="w-full flex-row p-5">
      <div className="w-full flex flex-row justify-between items-center max-w-[1100px] ml-auto mr-auto pb-5">
        <TextField
          id="search"
          label="Søk på anledning..."
          variant="outlined"
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: "white",
            width: "200px",
            height: "40px",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              height: "40px",
            },
            "& .MuiInputLabel-root": {
              top: "-5px",
            },
          }}
        />
        <FormControl sx={{ width: "200px", height: "40px" }}>
          <Select
            id="committeeDropdown"
            value={selectedCommittee || ""}
            onChange={(e) => setSelectedCommittee(e.target.value as string)}
            inputProps={{ "aria-label": "Without label" }}
            displayEmpty
            renderValue={(selected) => {
              if (selected === "") {
                return <span className="text-gray-500">Filtrer...</span>;
              }
              return selected;
            }}
            sx={{
              backgroundColor: "white",
              height: "40px",
              textAlign: "left", // Ensure the content inside is left-aligned
            }}
          >
            {/* Map over committee data */}
            {committeeData &&
              committeeData?.map((committee: Committee) => (
                <MenuItem key={committee.id} value={committee.name}>
                  {committee.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>

      <ReceiptTable
        receipts={filteredReceipts}
        onSetActive={handleSetStatusActive}
        onSetHistory={handleSetStatusHistory}
      />
    </div>
  );
};

export default AdminReceiptPage;
