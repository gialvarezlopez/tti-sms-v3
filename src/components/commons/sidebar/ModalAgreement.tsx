import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "@/components/ui/button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalAgreement = ({ isOpen, onClose }: ModalProps) => {
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-[425px] bg-[#FCFCFC]/100 rounded-lg p-4 max-w-full md:max-w-[50%] mx-3 boxShadow-400"
          overlayColor="bg-black/40"
        >
          <DialogHeader>
            <DialogTitle>
              <div className="flex gap-3 items-center">
                <span className="font-bold text-2xl">Agreement</span>
              </div>
            </DialogTitle>
            <DialogDescription className="text-base text-black pt-4">
              <div className="space-y-3"></div>
            </DialogDescription>
          </DialogHeader>

          <div className="h-[calc(100vh-300px)] overflow-y-auto w-full rounded-md border p-4">
            GWAH Wireless Communication Policy The Company employs a number of
            different wireless devices for communication with our customers and
            our colleagues. This policy is intended to address the use of these
            devices and includes but is not limited to cellular devices and
            iPads. Our Wireless Communication Policy has been written from a
            Customer Service perspective while optimizing the value of our
            investment in this technology. However, the use of these wireless
            devices, if not properly controlled and monitored, can become a
            significant expense. In order to maximize our efficiency in the
            utilization of these devices and to minimize our expenses, we will
            be implementing a more standardized approach. Cellular Phones Grey
            Wolf Animal Health (GWAH) will provide cellular phones to all
            individuals whom it feels requires use of a cellular phone to carry
            out their daily duties. It is our intention to use service providers
            that will be able to provide the best plan coverage in each region
            of the country at a reasonable cost. GWAH will decide which plans
            are appropriate per region and per group. It is the employee’s
            responsibility to comply with the GWAH Wireless Communication Policy
            and the responsibility of Corporate Office to review the policy and
            monitor the expenses to identify the areas that need to be brought
            to the attention of management to address problem usage by any
            specific user. In the event that an employee leaves the company, all
            phone numbers and cellular phones/accessories will remain the
            property of Grey Wolf Animal Health If the employee chooses to
            upgrade their phone to a newer model other then the standard model
            provided by Grey Wolf Animal Health, the employee will pay the
            difference in price and the device will remain property of Grey Wolf
            Animal Health should the user leave the company. In the event that
            an employee loses a cellular phone, they must immediately contact
            our Cell Phone Coordinator (contact details will be provided to
            employees) to have their phone suspended, as well as communicate via
            Email with the IT Director to obtain further instructions. In the
            event the employee fails to return a cellular phone upon termination
            of employment, the employee will be charged for the replacement cost
            for the particular model of phone in question. The Finance
            Department will administer the contract with the service provider
            and will be responsible for the acquisition of equipment and
            revisions to current plans. Any branch requests to reassign a phone
            or modify an existing plan must be communicated via Email to the IT
            Director. Brand and type of equipment and accessories provided is at
            the discretion of Grey Wolf Animal Health. We will attempt to
            provide the user with up-to-date technology ensuring quality and
            cost is at an optimum level. As with all company property, employees
            are responsible for this equipment while it is in their possession.
            The Employee agrees to take all reasonable measures to ensure that
            the equipment is maintained in good working order, and is returned,
            upon demand or termination of employment, in like condition as when
            same was issued, taking into consideration normal wear and/or
            deterioration. Any repairs to the equipment required as a direct
            result of misuse or negligence by the Employee will be at the
            expense of the Employee. It is understood and agreed that all
            wireless devices remain the property of GWAH, and GWAH reserves its
            full proprietary rights, up to and including repossession. Abuse to
            all wireless devices or disregard to the Wireless Communication
            Policy, will be subject to reclaiming the equipment and/or canceling
            the service. All employees that are given a wireless device must
            sign a Wireless Equipment Receipt Acknowledgement Form consenting to
            the conditions of the Wireless Communication Policy. Electronic
            Device Acknowledgement I acknowledge that: I have received the
            listed device. any device provided by Grey Wolf Animal Health remain
            the property of the Company, even if I have contributed to paying
            all or part of the device price attributable to my personal
            selection being different from the company’s offering, or as a
            result of an early replacement. upon returning the device, I will
            ensure to remove the personal ID (Apple ID, Google ID). abuse to all
            wireless devices or disregard to the Wireless Communication Policy,
            will be subject to reclaiming the equipment and/or canceling the
            service. Employee name: gio gio I hereby acknowledge to having read,
            understood, and consent to the conditions stipulated in the Wireless
            Communication Policy. I also understand that I am responsible for
            abiding by the terms of the said policy.
          </div>

          <DialogFooter>
            <Button type="button" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalAgreement;
