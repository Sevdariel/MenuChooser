import { DebugElement, Injectable } from "@angular/core";
import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { TestElement } from "./test-helpers.model";

export class TestHelpers {
    public static findElementById<T>(fixture: ComponentFixture<T>, testId: string): DebugElement {
        return fixture.debugElement.query(By.css(`#${testId}`));
    }

    public static click<T>(fixture: ComponentFixture<T>, testId: string): void {
        const element = this.findElementById(fixture, testId);

        const event = this.makeEventClick(element.nativeElement);
        element.triggerEventHandler('click', event);
    }

    public static expectText<T>(
        fixture: ComponentFixture<T>,
        testId: string,
        text: string): void {
        const element = this.findElementById(fixture, testId);
        const actualText = element.nativeElement.textContent;
        expect(actualText).toBe(text);
    }

    public static setFieldValue<T>(
        fixture: ComponentFixture<T>,
        testId: string,
        value: string,
    ): void {
        setFieldElementValue(this.findElementById(fixture, testId).nativeElement, value);
    }


    private static makeEventClick(target: EventTarget): Partial<MouseEvent> {
        return {
            preventDefault(): void { },
            stopPropagation(): void { },
            stopImmediatePropagation(): void { },
            type: 'click',
            target,
            currentTarget: target,
            bubbles: true,
            cancelable: true,
            button: 0
        };
    }

    private static setFieldElementValue(element: TestElement, value: string) {
        element.value = value;
        this.dispatchFakeEvent(element, 'input')
    }

    private static dispatchFakeEvent(
        element: EventTarget,
        type: string,
    ): void {
        const event = document.createEvent('Event');
        event.initEvent(type, false);
        element.dispatchEvent(event);
    }
}