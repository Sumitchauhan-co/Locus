import React from 'react';
import { useForm } from 'react-hook-form';
import ContactContainer from '../components/ContactContainer';
import api from '../api/axios';
import axios from 'axios';
import {ScrollToTop} from '../components/ScrollTo';

interface FormInputs {
    fullName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

const ContactUs: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        // formState: { errors },
    } = useForm<FormInputs>();

    const onSubmit = async (data: FormInputs) => {
        try {
            await api.post('/api/contact/create', data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data);
            }
        }
        reset();
    };

    const text = watch('message', '');

    return (
        <ContactContainer>
            <ScrollToTop />

            <form
                className="h-fit min-w-fit"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="h-fit w-full mb-8">
                    <h1 className="w-full text-3xl font-semibold mb-2">
                        Contact Us
                    </h1>
                    <p className="text-(--light-text-color)">
                        Fill out the form below and we'll get back to you
                        shortly.
                    </p>
                </div>

                <div className="flex flex-col mb-8">
                    <label className="text-sm mb-2 font-semibold">
                        Full Name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Your name"
                        className="p-2 rounded-xl bg-(--input-color) pl-4 outline-none border-3 border-transparent focus-visible:border-(--input-ring-color)"
                        {...register('fullName', { required: true })}
                    />
                </div>
                <div className="w-fit flex sm:flex-row flex-col gap-4">
                    <div className="flex w-full flex-col mb-8">
                        <label className="text-sm mb-2 font-semibold">
                            Email
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Your email"
                            className="w-full p-2 rounded-xl bg-(--input-color) pl-4 outline-none border-3 border-transparent focus-visible:border-(--input-ring-color)"
                            {...register('email', { required: true })}
                        />
                    </div>
                    <div className="h-fit w-full flex flex-col mb-8">
                        <label className="text-sm mb-2 font-semibold">
                            Phone (optional)
                        </label>
                        <input
                            type="text"
                            placeholder="Phone"
                            className="w-full p-2 rounded-xl bg-(--input-color) pl-4 outline-none border-3 border-transparent focus-visible:border-(--input-ring-color)"
                            {...register('phone', { required: false })}
                        />
                    </div>
                </div>
                <div className="w-full flex flex-col mb-8">
                    <label className="text-sm mb-2 font-semibold">
                        Subject
                    </label>
                    <div className="w-full relative group">
                        <select
                            className="w-full p-2 rounded-xl bg-(--input-color) pl-4 outline-none appearance-none border-3 border-transparent focus-visible:border-(--input-ring-color) cursor-pointer"
                            {...register('subject', { required: true })}
                        >
                            <option hidden>Enter a subject</option>
                            <option className="text-sm">General Inquiry</option>
                            <option className="text-sm">
                                Techinal Support
                            </option>
                            <option className="text-sm">Sales</option>
                            <option className="text-sm">Feedback</option>
                            <option className="text-sm">Other</option>
                        </select>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:rotate-180 transition">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-chevron-down size-4 opacity-50"
                                data-fg-3ne6="0.42:0.6275:/src/app/components/ui/select.tsx:51:9:1927:49:e:ChevronDownIcon:::::s:CJQ0:1"
                                aria-hidden="true"
                                data-fg-3ne5="0.42:0.6275:/src/app/components/ui/select.tsx:50:7:1888:118:e:SelectPrimitive.Icon"
                            >
                                <path d="m6 9 6 6 6-6"></path>
                            </svg>
                        </span>
                    </div>
                </div>
                <div className="w-full flex flex-col mb-8">
                    <label className="text-sm mb-2 font-semibold">
                        Message
                    </label>
                    <textarea
                        className="text-sm mb-2 rounded-xl bg-(--input-color) p-2 outline-none border-3 border-transparent focus-visible:border-(--input-ring-color) transition-all ease-in duration-75"
                        placeholder="Tell us how can we help you..."
                        rows={5}
                        {...register('message', { maxLength: 300 })}
                        maxLength={300}
                    ></textarea>
                    <p className="text-sm text-(--light-text-color)">{`${text.length} / 300 characters`}</p>
                </div>
                <div className="w-full flex flex-col sm:flex-row gap-4">
                    <button
                        type="submit"
                        className="w-full bg-black text-white p-2 rounded-lg text-sm font-semibold"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="w-18 text-sm font-semibold border border-(--input-ring-color) rounded-xl p-2 hover:bg-(--clear-btn-hover-color)"
                    >
                        Clear
                    </button>
                </div>
            </form>
        </ContactContainer>
    );
};

export default ContactUs;
