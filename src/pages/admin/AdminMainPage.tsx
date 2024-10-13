import React from "react";
import Button from "../../components/universal/Button";

const AdminMainPage = () => {
  return (
    <div className="mt-[100px] gap-4 flex justify-center z-0">
      <Button href="/admin/kvittering" title="Kvittering" color="blue" />
      <Button href="/admin/soknad" title="Søknad" color="blue" />
    </div>
  );
};

export default AdminMainPage;
