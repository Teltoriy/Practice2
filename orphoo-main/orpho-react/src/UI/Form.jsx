import './Form.css'
import {Link} from 'react-router-dom'
function Form(props)
{
    return (
        <div className='Reg'>
            <form className='Reg-form' id='reg'>
                <div className='title'>{props.title || 'Регистрация'}</div>
                    <div className='input-container'>
                        <div className='input-group'>
                        <label htmlFor='nick'>Имя </label>
                        <input id='nick' type={'text'} className = 'reg-input'></input>
                        </div>
                        <div className='input-group'>
                            <label htmlFor='pass'>Пароль</label>
                            <input id='pass' type={'password'} className = 'reg-input'></input>
                        </div>
                    </div>    
                <input type={'submit'} className = 'submit' value={'Go'}></input>                   
            </form>
            <footer>{props.quest || 'Уже зарегистрированы?'} <Link to={props.a || '/log'}>{props.link || 'Войти'}</Link> </footer>
        </div>
    )
}
export default Form