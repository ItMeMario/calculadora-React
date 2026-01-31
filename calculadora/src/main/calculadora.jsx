import React, { Component } from 'react';
import './calculadora.css';

import Button from '../componentes/button/button';
import Display from '../componentes/display/display';

const initialState = {
    displayValue: '0',
    calculated: false
}

export default class Calculadora extends Component {

    state = { ...initialState }

    constructor(props) {
        super(props)
        this.clearMemory = this.clearMemory.bind(this)
        this.setOperation = this.setOperation.bind(this)
        this.addDigit = this.addDigit.bind(this)
    }

    clearMemory() {
        this.setState({ ...initialState })
    }

    setOperation(operation) {
        if (operation === '=') {
            this.calculate()
            return
        }

        let { displayValue, calculated } = this.state

        if (calculated) {
            // If we just calculated "1+1 = 2", and user hits "+", we want "2+"
            // We extract the result (number after the last ' ')
            const parts = displayValue.split(' = ')
            displayValue = parts[parts.length - 1]
            calculated = false
        } else if (displayValue === '0') {
            // Avoid "0+" unless desired, but usually okay. 
            // If user wants negative number, they might type "-".
            // Let's allow standard behavior.
        }

        // Prevent double operators (e.g. "1++")
        const lastChar = displayValue.slice(-1)
        if (['+', '-', '*', '/'].includes(lastChar)) {
            // Replace last operator
            displayValue = displayValue.slice(0, -1) + operation
        } else {
            displayValue = displayValue + operation
        }

        this.setState({ displayValue, calculated })
    }

    addDigit(n) {
        if (n === '.' && this.state.displayValue.includes('.')) {
            // This is a naive check. Ideally we check the *current number segment*.
            // But for simple expression logic, we check if the last number has a dot.
            const segments = this.state.displayValue.split(/[\+\-\*\/]/)
            const currentSegment = segments[segments.length - 1]
            if (currentSegment.includes('.')) return
        }

        let { displayValue, calculated } = this.state

        if (calculated) {
            displayValue = n
            calculated = false
        } else {
            // Remove leading zero if it's the only char, unless typing '.'
            if (displayValue === '0' && n !== '.') {
                displayValue = n
            } else {
                displayValue = displayValue + n
            }
        }

        this.setState({ displayValue, calculated })
    }

    calculate() {
        if (this.state.calculated) return

        try {
            // eslint-disable-next-line
            const result = eval(this.state.displayValue) // Be careful with eval generally, but okay for this scope

            if (isNaN(result) || !isFinite(result)) {
                this.setState({ displayValue: 'Error', calculated: true })
            } else {
                const newDisplay = `${this.state.displayValue} = ${result}`
                this.setState({ displayValue: newDisplay, calculated: true })
            }
        } catch (e) {
            this.setState({ displayValue: 'Error', calculated: true })
        }
    }

    render() {
        return (
            <div className="calculator">
                <Display value={this.state.displayValue} />
                <Button label="AC" click={this.clearMemory} triple />
                <Button label="/" click={this.setOperation} operation />
                <Button label="7" click={this.addDigit} />
                <Button label="8" click={this.addDigit} />
                <Button label="9" click={this.addDigit} />
                <Button label="*" click={this.setOperation} operation />
                <Button label="4" click={this.addDigit} />
                <Button label="5" click={this.addDigit} />
                <Button label="6" click={this.addDigit} />
                <Button label="-" click={this.setOperation} operation />
                <Button label="1" click={this.addDigit} />
                <Button label="2" click={this.addDigit} />
                <Button label="3" click={this.addDigit} />
                <Button label="+" click={this.setOperation} operation />
                <Button label="0" click={this.addDigit} double />
                <Button label="." click={this.addDigit} />
                <Button label="=" click={this.setOperation} operation />
            </div>
        )
    }
}
