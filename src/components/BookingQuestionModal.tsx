import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from './ui/dialog'; // adjust the path if needed
import { Switch } from './ui/switch';
import { CustomSelect } from './ui/custom-select';

interface BookingQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question?: {
    label: string;
    type: string;
    required: string;
  };
}

export const BookingQuestionModal = ({ isOpen, onClose, question }: BookingQuestionModalProps) => {
  const [inputType, setInputType] = useState('Name');
  const [splitName, setSplitName] = useState(false);
  const [identifier, setIdentifier] = useState('name');
  const [disableInput, setDisableInput] = useState(false);
  const [label, setLabel] = useState('your_name');
  const [placeholder, setPlaceholder] = useState('John Doe');
  const [required, setRequired] = useState('Yes');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-6 max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#384252]">Add a question</DialogTitle>
          <DialogDescription className="text-sm text-[#384252]">
            Customize the questions asked on the booking page
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-[#384252]">Input type</label>
            <CustomSelect
              value={inputType}
              onValueChange={setInputType}
              options={[
                { label: 'Email', value: 'Email' },
                { label: 'Phone', value: 'Phone' },
                { label: 'Address', value: 'Address' },
                { label: 'Short Text', value: 'Short Text' },
                { label: 'Number', value: 'Number' },
                { label: 'Long Text', value: 'Long Text' },
                { label: 'Select', value: 'Select' },
                { label: 'MultiSelect', value: 'MultiSelect' },
                { label: 'Multiple Emails', value: 'Multiple Emails' },
                { label: 'Checkbox Group', value: 'Checkbox Group' },
                { label: 'Radio Group', value: 'Radio Group' },
                { label: 'Checkbox', value: 'Checkbox' },
                { label: 'URL', value: 'URL' },
                // Add more options as needed
              ]}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-[#384252]">
              Split "Full name" into "First name" and "Last name"
            </label>
            <Switch checked={splitName} onCheckedChange={setSplitName} />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#384252]">Identifier</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={disableInput}
              onChange={(e) => setDisableInput(e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm text-[#384252]">
              Disable input if the URL identifier is prefilled
            </label>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#384252]">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#384252]">Placeholder</label>
            <input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#384252]">Required</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRequired('Yes')}
                className={`px-4 py-2 rounded-lg border text-sm ${
                  required === 'Yes'
                    ? 'bg-gray-200 border-gray-400'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setRequired('No')}
                className={`px-4 py-2 rounded-lg border text-sm ${
                  required === 'No'
                    ? 'bg-gray-200 border-gray-400'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
