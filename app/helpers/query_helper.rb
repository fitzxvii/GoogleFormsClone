module QueryHelper
    extend ActiveSupport::Concern

	# MODEL HELPERS for simple repetitive MySQL queries
    module ClassMethods
		def query_record(sql_statement)
            active_connection = get_available_connection?

            if !connection.nil?
                active_connection.select_one(
                    ActiveRecord::Base.send(:sanitize_sql_array, sql_statement)
                )
            end
        ensure
            ActiveRecord::Base.clear_active_connections!
		end

		def query_records(sql_statement)
            active_connection = get_available_connection?

            if !connection.nil?
                active_connection.exec_query(
                    ActiveRecord::Base.send(:sanitize_sql_array, sql_statement)
                )
            end
        ensure
            ActiveRecord::Base.clear_active_connections!
        end
        
        def insert_record(sql_statement)
            active_connection = get_available_connection?

            if !connection.nil?
                active_connection.insert(
                    ActiveRecord::Base.send(:sanitize_sql_array, sql_statement)
                )
            end
        ensure
            ActiveRecord::Base.clear_active_connections!
        end

        def update_record(sql_statement)
            active_connection = get_available_connection?

            if !connection.nil?
                active_connection.update(
                    ActiveRecord::Base.send(:sanitize_sql_array, sql_statement)
                )
            end
        ensure
            ActiveRecord::Base.clear_active_connections!
        end

        def delete_record(sql_statement)
            active_connection = get_available_connection?

            if !connection.nil?
                active_connection.delete(
                    ActiveRecord::Base.send(:sanitize_sql_array, sql_statement)
                )
            end
        ensure
            ActiveRecord::Base.clear_active_connections!
        end

        def datetime_now
            Time.now.utc.strftime("%Y-%m-%d %H:%M:%S")
        end

        private 

            def get_available_connection?
                active_connection = nil            
                ActiveRecord::Base.connection_pool.with_connection { |connection| active_connection = connection }

                return active_connection 
            end
    end
end