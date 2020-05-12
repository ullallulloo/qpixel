class SuggestedEdit < ApplicationRecord
    include PostRelated

    belongs_to :user

    belongs_to :decided_by, class_name: "User", optional: true
    has_and_belongs_to_many :tags

    def pending?
        active
    end

    def approved?
        !active && accepted
    end

    def rejected?
        !active && !accepted
    end
end
