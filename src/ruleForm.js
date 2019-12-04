import gql from "graphql-tag";
import React from "react";
import { Mutation } from "react-apollo";
import { connect } from "react-redux";
import { testClient } from "../../App";
import { Title } from "../../Common/Components/Title";
import { RULES_TABLE_GQL } from "../../Common/gql-query";
import { isValidRuleForm } from "../ControlSummary/ValidationHelper";
import ExceptionsList from "../exceptions";
import { ValidationStatus } from "./ValidationStatus";

const PLACEHOLDER = {
  RN: "Name of the rule", RT: "Type of the rule", RDESC: "Describe the rule's purpose and objective",
  RID: "Unique rule identifier", RSPEC: "GraphQL Rule", RVAR: "Insert the Variables"
}

const SAVERULE = gql`mutation writeRules($ruleId: String, $runeName: String, $ruleDesc: String, $productFamilyId: Int,
$controlId: String, $ruleDef: String, $ruleType: String,$ruleVariables:String) {
    writeRules(ruleId: $ruleId, ruleName: $runeName, ruleDesc: 
      $ruleDesc, productFamilyId: $productFamilyId, controlId: $controlId, ruleDef: $ruleDef, ruleType: $ruleType,ruleVariables:$ruleVariables) 
      { ruleId ruleDesc  ruleDef ruleVariables}
    }`;

class RulemasterformComponent extends React.Component {
  state = {
    productFamilyId: this.props.data, controlId: this.props.data,
    ruleId: this.props.ruleId || "",
    ruleName: this.props.ruleName || "",
    ruleDesc: this.props.ruleDesc || "",
    formType: this.props.formType,
    validationStatus: "", ruleVariables: "", schemaField: "",
    error: "null", showValidationStatus: false
  }

  componentDidMount() {
    const { ruleId, ruleName, ruleDesc, controlId, productFamilyId, ruleDef, ruleType, ruleVariables, formType } = this.props
    this.setState({ ruleId, ruleName, ruleDesc, controlId, productFamilyId, ruleDef, ruleType, ruleVariables, formType })
  }

  handleControlTypeSelection = (obj) => {
    if (obj && obj.value) this.setState({ controlType: obj.value })
  }
  handlechange = (e) => {
    const { name, value } = e.target
    if (name === "ruleDef" || name === "ruleVariables") {
      this.props.setExceptionTestTable(null)
      this.setState({ validationStatus: "", showValidationStatus: false })
    }
    this.setState({ [name]: value, showValidationStatus: false })

  }

  renderTestFields = ({ isview }) => {
    const { error } = this.state
    const isreadonly = isview
    return <div ref={this.props.ruleformRef} className="form-group">
      <label className="required pnc-form-lable">Rule Specification</label>
      <textarea name="ruleDef" className="pnc-form-control textareacontrol"
        placeholder={PLACEHOLDER.RSPEC} value={this.state.ruleDef} rows={4}
        disabled={isview} onChange={this.handlechange}
        style={this.state.ruleDefstyle} cols="10" rows="10">
      </textarea>      
      <label className="required pnc-form-lable">Rule variables</label>
      <textarea name="ruleVariables" className="pnc-form-control textareacontrol"
        placeholder={PLACEHOLDER.RVAR} cols="5" rows="5"
        disabled={isview} onChange={this.handlechange} value={this.state.ruleVariables}
      >
      </textarea>
      {
        error && error.ruleDef && <div className="pnc-invalid-feedback">{error.ruleDef}</div>
      }
    </div>

  }

  handleSave = (saveRule, e) => {
    e.preventDefault();
    if (this.props.activateform) {
      this.props.onClose(); return
    }
    const error = isValidRuleForm(this.state);
    if (!error) {
      const { ruleId, ruleName, ruleDesc, productFamilyId, ruleDef, controlId, controlName, ruleVariables } = this.state
      saveRule({
        variables: {
          ruleId, runeName: ruleName,
          ruleDesc, productFamilyId, controlId, ruleDef, controlName, ruleVariables
        }
      });
      this.props.handleToggle()
    }
    this.setState({ error });

  };

  renderForm = (saveRule) => {

    const { error, validationStatus } = this.state
    const { exceptionTestData } = this.props
    const isview = this.props.activateform
    const productFamilyData = exceptionTestData && Object.values(exceptionTestData)[0] || []

    return (
      <form className="rule-form-container">
        <div className="form-group">
          <div className="row">
            <div className="col-md-4">
              <label className="required pnc-form-lable">Control Identifier</label>
              <input className="pnc-form-control" autoFocus value={this.state.controlId}
                disabled={this.props.controlId ? true : false || isview} name="controlId"
                placeholder={PLACEHOLDER.RID} onChange={this.handlechange} type="text" />
              {this.props.controlId && <div className="text-read"> </div>}
            </div>
            <div className="col-md-8">
              <label className="required pnc-form-lable">Rule Identifier</label>
              <input className="pnc-form-control" autoFocus value={this.state.ruleId}
                disabled={this.props.ruleId ? true : false || isview} name="ruleId"
                placeholder={PLACEHOLDER.RID} onChange={this.handlechange} type="text" />
              {this.props.ruleId && <div className="text-read"> </div>}
              {
                error && error.ruleId && <div className="pnc-invalid-feedback">{error.ruleId}</div>
              }
            </div>
            <div className="col-md-12">
              <label className="required pnc-form-lable">Rule Name</label>
              <input className="pnc-form-control" value={this.state.ruleName}
                placeholder={PLACEHOLDER.RN} disabled={isview} name="ruleName"
                onChange={this.handlechange} type="textarea" />
              {isview && <div className="text-read"></div>}
              {
                error && error.ruleName && <div className="pnc-invalid-feedback">{error.ruleName}</div>
              }
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="required pnc-form-lable">Rule Description</label>
          <input className="pnc-form-control" value={this.state.ruleDesc}
            placeholder={PLACEHOLDER.RDESC} disabled={isview} name="ruleDesc"
            onChange={this.handlechange}
            type="textarea" />
          {isview && <div></div>}
          {
            error && error.ruleDesc && <div className="pnc-invalid-feedback">{error.ruleDesc}</div>
          }
        </div>
        {
          this.renderTestFields({ isview })
        }
        {this.state.showValidationStatus && !isview &&
          <ValidationStatus onClose={() => this.setState({ showValidationStatus: false })}
            validationStatus={this.state.validationStatus} />}
        <div className="text-right">
          {((validationStatus && validationStatus.data && this.props.ruleId) || isview || this.props.formType == "edit") && <input type="button"
            name="Deactivate" className="pnc-button"
            value={isview && "Confirm" || "Deactivate"}
            onClick={() => this.props.ondeactivate(isview && "activate" || "deactivate")} />}
          {(validationStatus && validationStatus.data && !isview || this.props.formType == "edit") && <input type="button"
            value={isview && "Cancel" || "Save"} name="Next" className="pnc-button"
            onClick={e => this.handleSave(saveRule, e)}


          />}
          {!isview &&

            <input type="button" name="Test" className="pnc-button" value="Test"
              onClick={this.handleTest} />
          }
        </div>
        {
          exceptionTestData &&
          <div className="margin-top-10">
            <Title noCollapse={true} message={productFamilyData.length + " Results Found"} />
            <ExceptionsList source="ruleForm" />
          </div>
        }
      </form>
    )
  }
  handleTest = async (e) => {
    e.preventDefault()
    let result;
    const error = isValidRuleForm(this.state);
    if (!error) {
      try {
        this.setState({ validationStatus: "Loading", showValidationStatus: true })
        const ruleVariables = this.state.ruleVariables
        let variables = ruleVariables.length > 0 && JSON.parse(ruleVariables) || null
        const payLoad = {

          query: gql`${this.state.ruleDef}`,
          fetchPolicy: "no-cache"
        }
        if (ruleVariables.length != 0) {
          payLoad.variables = variables
        } else {
          payLoad.variables = null
        }
        result = await testClient.query(payLoad)

        const data = result.data && Object.values(result.data)
        if (Array.isArray(data)) {
          console.log("rulevariablesexist", result.data)
          this.props.setExceptionTestTable(result.data)
        }
        this.setState({ validationStatus: result, showValidationStatus: true })
      } catch (error) {
        if (!error.graphQLErrors) {
          const syntaxerror = [
            error
          ]
          this.setState({ validationStatus: syntaxerror, showValidationStatus: true })
          return
        }
        this.setState({ validationStatus: error.graphQLErrors, showValidationStatus: true })
        this.props.setExceptionTestTable(null)
      }
    }
    this.setState({ error });

  }
  componentWillUnmount() {
  }

  render() {
    const { control, productFamily } = this.props
    const variables = {
      pfId: productFamily.productFamilyId,
      bfId: control ? control.controlId : "-1",
      ruleVariables: this.state.ruleVariables
    }
    return (
      <React.Fragment>
        <div className="float-right">An  asterisk (*) field is required</div>
        <Mutation
          refetchQueries={() => [{ query: RULES_TABLE_GQL, variables: variables }]}
          mutation={SAVERULE}>
          {(saveRule, { data }) => {
            return (
              this.props.ruleId && <form {...this.props}
                onSave={this.onSave} onClose={this.props.onClose}>
                {this.renderForm(saveRule)}
              </form>
              || this.renderForm(saveRule)
            )
          }}
        </Mutation>
      </React.Fragment>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    control: state.doActionsReducer.control,
    productFamily: state.doActionsReducer.productFamily,
  }
}
export const Rulemasterform = connect(mapStateToProps)(RulemasterformComponent)