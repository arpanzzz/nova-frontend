import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

type HardwareActionFormValues = {
  Title: string | null;
  Action_Date: string | null;
  Action_Type: string | null;
  Action_Details: string | null;
  In_Out: string | null;
  Received_From: string | null;
  Issue_To: string | null;
  Entered_By: string | null;
  Expenses: number | null;
  Remarks: string | null;
};

const HardwareActionForm = () => {
  const cookieData = Cookies.get('selected');
  const parsed = cookieData ? JSON.parse(cookieData) : {};

  const { register, handleSubmit, setValue } = useForm<HardwareActionFormValues>({
    defaultValues: {
      Title: parsed.Title ?? '',
      Action_Date: parsed.Action_Date ?? '',
      Action_Type: parsed.Action_Type ?? '',
      Action_Details: parsed.Action_Details ?? '',
      In_Out: parsed.In_Out ?? '',
      Received_From: parsed.Received_From ?? '',
      Issue_To: parsed.Issue_To ?? '',
      Entered_By: parsed.Entered_By ?? '',
      Expenses: parsed.Expenses ?? 0,
      Remarks: parsed.Remarks ?? '',
    },
  });

  const onSubmit = async (data: HardwareActionFormValues) => {
    const modalType = Cookies.get('modalType');
    console.log('Modal Type:', modalType);
    const token = sessionStorage.getItem('token');
    const actionId = parsed.RecID;

    if (!token || !actionId) {
      toast.error('Missing token or Action ID');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/manage-services/update/${actionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Hardware action updated successfully', {
          description: JSON.stringify(result),
        });
      } else {
        toast.error('Update failed', {
          description: result?.message || 'An error occurred',
        });
      }
    } catch (error: any) {
      toast.error('Unexpected error', {
        description: error?.message || 'Something went wrong',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Update Hardware Action</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Title</label>
          <Input {...register('Title')} placeholder="Enter a short title for the action" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Action Date</label>
          <Input {...register('Action_Date')} type="date" placeholder="Select the date of action" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Action Type</label>
          <Input {...register('Action_Type')} placeholder="e.g. Repair, Replace, Install" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600 block mb-1">Action Details</label>
          <Textarea {...register('Action_Details')} placeholder="Describe the hardware action in detail" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">In / Out</label>
          <Input {...register('In_Out')} placeholder="Enter 'In' or 'Out'" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Received From</label>
          <Input {...register('Received_From')} placeholder="Name or department from whom it was received" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Issue To</label>
          <Input {...register('Issue_To')} placeholder="Name or department the item was issued to" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Entered By</label>
          <Input {...register('Entered_By')} placeholder="Person entering the data" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Expenses</label>
          <Input
            {...register('Expenses', { valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="Enter cost incurred (if any)"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600 block mb-1">Remarks</label>
          <Textarea {...register('Remarks')} placeholder="Additional notes or comments" />
        </div>
      </div>

      <div className="text-right pt-4">
        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default HardwareActionForm;
