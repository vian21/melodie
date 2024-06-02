"use client";

import { useRef } from "react";

interface PinInputGridProps {
    pin: Array<number | undefined>;
    verification?: Array<number | undefined>;
    onPinChanged: (pinEntry: number | undefined, index: number) => void;
    pinLength: number;
}

const PIN_MIN_VALUE = 0;
const PIN_MAX_VALUE = 9;
const BACKSPACE_KEY = "Backspace";

const PinInput: React.FC<PinInputGridProps> = ({
    pinLength,
    pin,
    verification,
    onPinChanged,
}) => {
    const inputRefs = useRef<HTMLInputElement[]>([]);

    const changePinFocus = (pinIndex: number) => {
        const ref = inputRefs.current[pinIndex];
        if (ref) {
            ref.focus();
        }
    };

    const removeValuesFromArray = (valuesArray: string[], value: string) => {
        const valueIndex = valuesArray.findIndex((entry) => entry === value);
        if (valueIndex === -1) {
            return;
        }
        valuesArray.splice(valueIndex, 1);
    };

    const onChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => {
        const previousValue = event.target.defaultValue;
        const valuesArray = event.target.value.split("");
        removeValuesFromArray(valuesArray, previousValue);
        const value = valuesArray.pop();
        if (!value) {
            return;
        }
        const pinNumber = Number(value.trim());
        if (Number.isNaN(pinNumber) ?? value.length === 0) {
            //TODO: not working on Firefox and Safari
            return;
        }

        if (pinNumber >= PIN_MIN_VALUE && pinNumber <= PIN_MAX_VALUE) {
            onPinChanged(pinNumber, index);
            if (index < pinLength - 1) {
                changePinFocus(index + 1);
            }
        }
    };

    const onKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
        index: number,
    ) => {
        const keyboardKeyCode = event.nativeEvent.code;
        if (keyboardKeyCode !== BACKSPACE_KEY) {
            return;
        }

        if (pin[index] === undefined) {
            changePinFocus(index - 1);
        } else {
            onPinChanged(undefined, index);
        }
    };

    return (
        <>
            <div>
                {Array.from({ length: pinLength }, (_, index) => (
                    <input
                        type="number"
                        className={`text-md m-3 w-12 border-2 ${verificationColor(
                            verification?.[index],
                        )} p-3 text-center text-2xl text-black [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                        onKeyDown={(event) => onKeyDown(event, index)}
                        key={index}
                        ref={(el) => {
                            if (el) {
                                inputRefs.current[index] = el;
                            }
                        }}
                        onChange={(event) => onChange(event, index)}
                        value={pin[index] ?? ""}
                    />
                ))}
            </div>
        </>
    );
};

function verificationColor(state: number | undefined) {
    switch (state) {
        case 0:
            return "border-red-500";
        case 1:
            return "border-green-500";
        default:
            return "border-black";
    }
}
export default PinInput;
