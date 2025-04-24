// components/Breadcrumb.js
import Image from "next/image";

const Breadcrumb = () => (
  <div className="bread-crump">
    <Image
      src="/img/empgrey.png"
      alt="Employee Grey Icon"
      height={5}
      width={13}
      className="bread-crumb-image"
    />
    <p>Employability Dashboard</p>
  </div>
);

export default Breadcrumb;
