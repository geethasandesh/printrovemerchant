import React from 'react';
import { Button } from './Button';

interface FixedFooterProps {
    content?: React.ReactNode;
    onCancel?: () => void;
    onContinue?: () => void;
    secondaryBtnText?: string;
    primaryBtnText?: string;
}

const FixedFooter = (props: FixedFooterProps) => {
    const { content, onCancel, onContinue, secondaryBtnText, primaryBtnText = 'Continue' } = props;


    return (
        <div className={`fixed bottom-0 left-64 w-[calc(100%-16rem)] bg-white border-t border-gray-300 fixed-footer-left px-4 py-3 flex gap-4 shadow-md ${content ? "justify-between" : "justify-end"
            }`}>
            {content}
            {secondaryBtnText && <Button variant='secondary' className='custom-tertiary-btn' onClick={onCancel ? onCancel : undefined}>{secondaryBtnText}</Button>}
            <Button onClick={onContinue ? onContinue : undefined}>{primaryBtnText}</Button>
        </div>
    );
};

export default FixedFooter;