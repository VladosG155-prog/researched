'use client';
import Modal from '../modal';
import parse, { domToReact } from 'html-react-parser';
interface BreachModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        date: string;
        title: string;
        description: string;
        consequences: string;
    }[];
}

const BreachModal = ({ isOpen, onClose, data }: BreachModalProps) => {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Случаи взломов">
            {data.map((item) => {
                return (
                    <div key={item.title} className="p-3">
                        <p className="text-[#949292]">{item.date}</p>
                        <p>{item.title}</p>
                        <p>{parse(item.description)}</p>

                        <p>{parse(item.consequences)}</p>
                        <hr className="mt-5" />
                    </div>
                );
            })}
        </Modal>
    );
};

export default BreachModal;
