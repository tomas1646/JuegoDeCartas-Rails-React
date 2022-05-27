class ApplicationController < ActionController::Base
    skip_before_action :verify_authenticity_token

    def render_error_response (content, message = "Unexpected Error", status = 400)
        render status: status, json: {status: status, success: false, message: message, content: content}
    end

    def render_success_response (content, message = "Action completed successfully", status = 200)
        render status: status, json: {status: status, success: true, message: message, content: content}
    end
end
