class Token {
    constructor(type, value) {
      this.type = type;
      this.value = value;
    }
  }
  
  class Lexer {
    constructor(input) {
      this.input = input;
      this.tokens = [];
      this.current = 0;
      this.tokenize();
    }
  
    tokenize() {
      const keywords = ['class', 'public', 'static', 'void', 'print'];
      const regex = /\b(class|public|static|void|print)\b|[{}();"]|\w+/g;
      let match;
  
      while ((match = regex.exec(this.input)) !== null) {
        const [value] = match;
        if (keywords.includes(value)) {
          this.tokens.push(new Token('KEYWORD', value));
        } else if (/\d+/.test(value)) {
          this.tokens.push(new Token('NUMBER', Number(value)));
        } else if (/".*"/.test(value)) {
          this.tokens.push(new Token('STRING', value.slice(1, -1)));
        } else if (/[{}();]/.test(value)) {
          this.tokens.push(new Token('SYMBOL', value));
        } else {
          this.tokens.push(new Token('IDENTIFIER', value));
        }
      }
    }
  }
  
  class Parser {
    constructor(tokens) {
      this.tokens = tokens;
      this.current = 0;
    }
  
    parse() {
      const ast = { type: 'Program', body: [] };
      while (this.current < this.tokens.length) {
        ast.body.push(this.parseStatement());
      }
      return ast;
    }
  
    parseStatement() {
      let token = this.tokens[this.current];
      if (token.type === 'KEYWORD' && token.value === 'print') {
        this.current++;
        let arg = this.tokens[this.current];
        this.current++;
        this.current++; // Skip ";"
        return { type: 'PrintStatement', value: arg.value };
      }
      throw new Error(`Unexpected token: ${token.value}`);
    }
  }
  
  class Interpreter {
    constructor(ast) {
      this.ast = ast;
    }
  
    execute() {
      for (const node of this.ast.body) {
        if (node.type === 'PrintStatement') {
          console.log(node.value);
        }
      }
    }
  }
  
  // Sample Jaz Code
  const jazCode = `
  class HelloWorld {
    public static void main() {
      print("Hello, World!");
    }
  }`;
  
  const lexer = new Lexer(jazCode);
  const parser = new Parser(lexer.tokens);
  const interpreter = new Interpreter(parser.parse());
  
  interpreter.execute();
  