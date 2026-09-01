import type { WhatsAppCustomer } from "@/lib/orderMessaging";

type Props = {
  customer: WhatsAppCustomer;
  onChange: (customer: WhatsAppCustomer) => void;
};

export function validateCustomerDetails(customer: WhatsAppCustomer) {
  const required: Array<keyof WhatsAppCustomer> = [
    "name",
    "phone",
    "email",
    "address",
    "city",
    "state",
    "pincode",
  ];

  if (required.some((field) => !customer[field].trim())) {
    return "Please fill all required customer details.";
  }
  if (!/^\S+@\S+\.\S+$/.test(customer.email)) {
    return "Please enter a valid email address.";
  }
  if (!/^\d{10}$/.test(customer.phone.replace(/\D/g, ""))) {
    return "Please enter a valid 10-digit mobile number.";
  }
  if (!/^\d{6}$/.test(customer.pincode.trim())) {
    return "Please enter a valid 6-digit pincode.";
  }

  return "";
}

export default function CustomerDetailsForm({ customer, onChange }: Props) {
  const update = (field: keyof WhatsAppCustomer, value: string) => {
    onChange({ ...customer, [field]: value });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Full Name *" value={customer.name} onChange={(value) => update("name", value)} />
      <Field label="Mobile Number *" value={customer.phone} onChange={(value) => update("phone", value)} inputMode="numeric" />
      <Field label="Email *" value={customer.email} onChange={(value) => update("email", value)} type="email" />
      <Field label="Pincode *" value={customer.pincode} onChange={(value) => update("pincode", value)} inputMode="numeric" />
      <div className="sm:col-span-2">
        <Field label="Complete Address *" value={customer.address} onChange={(value) => update("address", value)} />
      </div>
      <Field label="City *" value={customer.city} onChange={(value) => update("city", value)} />
      <Field label="State *" value={customer.state} onChange={(value) => update("state", value)} />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
      />
    </label>
  );
}
