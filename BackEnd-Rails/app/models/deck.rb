class Deck 
    private_class_method :new
    attr_accessor :cards

    def self.instance
        @@instance ||= new
    end

    def initialize
        array = []
        for i in ["-Or" , "-Ba", "-Es", "-Co"]
            for j in 1..12
                array.push(j.to_s + i)
            end
        end
        @cards = array
    end

    def get_card
        @cards[Random.rand(48)]
    end
end
